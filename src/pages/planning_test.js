import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const getCoordinatesFromAddress = async (address) => {
  if (!address) return null;

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } else {
      console.error(`Adresse introuvable pour : ${address}`);
      return null;
    }
  } catch (err) {
    console.error("Erreur Nominatim", err);
    return null;
  }
};

const calculateOSRMDistance = async (startCoord, endCoord, transportMode) => {
  // Vérifier que les coordonnées sont valides
  if (!startCoord?.lat || !startCoord?.lon || !endCoord?.lat || !endCoord?.lon) {
    console.warn('Coordonnées invalides pour le calcul de distance');
    return null;
  }

  const osrmProfiles = {
    'driving': 'driving',
    'walking': 'walking',
    'bicycle': 'cycling'
  };

  const baseUrl = 'https://router.project-osrm.org/route/v1';
  const profile = osrmProfiles[transportMode] || 'driving';
  
  try {
    
    console.log("Calcul : ", baseUrl, profile, startCoord.lon, startCoord.lat, endCoord.lon, endCoord.lat);
    
    const url = `${baseUrl}/${profile}/${startCoord.lon},${startCoord.lat};${endCoord.lon},${endCoord.lat}?overview=false`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Erreur OSRM:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      return {
        distance: data.routes[0].distance / 1000, 
        duration: data.routes[0].duration / 60 
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors du calcul de distance OSRM:', error);
    return null;
  }
};

const calculateHotelProximity = async (hotels, allDestinations, transportMode) => {
  // Ajouter les coordonnées avant de calculer
  const hotelsWithCoords = await Promise.all(
    hotels.map(async (hotel) => ({
      ...hotel,
      coordinates: hotel.location?.coordinates || 
                   await getCoordinatesFromAddress(hotel.location?.address)
    }))
  );

  // Filtrer les hôtels avec des coordonnées valides
  const validHotels = hotelsWithCoords.filter(
    hotel => hotel.coordinates?.lat && hotel.coordinates?.lon
  );

  // Initialiser le compteur de destinations
  validHotels.forEach(hotel => hotel.destinationCounter = 0);

  // Calculer la proximité
  console.log("Destinations : ", allDestinations);

  for (let destination of allDestinations) {

    console.log("Destination : ", destination, destination.lat, destination.lon);
    if (!destination.lat || !destination.lon) continue;

    let closestHotel = null;
    let minDistance = Infinity;

    for (let hotel of validHotels) {
      try {
        const distance = await calculateOSRMDistance(
          { 
            lat: hotel.coordinates.lat, 
            lon: hotel.coordinates.lon 
          },
          { 
            lat: destination.lat, 
            lon: destination.lon 
          },
          transportMode
        );

        if (distance && distance.distance < minDistance) {
          minDistance = distance.distance;
          closestHotel = hotel;
        }
      } catch (error) {
        console.error('Erreur lors du calcul de distance:', error);
      }
    }

    if (closestHotel) {
      closestHotel.destinationCounter++;
    }
  }

  // Trier les hôtels par nombre de destinations
  return validHotels.sort((a, b) => b.destinationCounter - a.destinationCounter);
};

const distributeNights = (hotels, totalNights) => {
  // Si aucun hôtel n'a de compteur, distribuer également
  if (hotels.every(hotel => hotel.destinationCounter === 0)) {
    const nightsPerHotel = Math.floor(totalNights / hotels.length);
    const remainder = totalNights % hotels.length;

    return hotels.map((hotel, index) => ({
      ...hotel,
      nights: nightsPerHotel + (index < remainder ? 1 : 0)
    }));
  }

  // Limiter le nombre d'hôtels au nombre de nuits
  const limitedHotels = hotels.slice(0, totalNights);

  // Calculer le total des compteurs
  const totalCounter = limitedHotels.reduce((sum, hotel) => sum + hotel.destinationCounter, 0);

  // Répartir les nuits proportionnellement
  const hotelNights = limitedHotels.map(hotel => {
    const proportionalNights = Math.max(
      1, 
      Math.round((hotel.destinationCounter / totalCounter) * totalNights)
    );
    return { 
      ...hotel, 
      nights: proportionalNights 
    };
  });

  // Ajuster pour correspondre exactement au nombre total de nuits
  const currentTotalNights = hotelNights.reduce((sum, hotel) => sum + hotel.nights, 0);
  if (currentTotalNights !== totalNights) {
    const diff = totalNights - currentTotalNights;
    hotelNights[0].nights += diff;
  }

  return hotelNights;
};

export default function PlanningPage() {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [activites, setActivites] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [restaurants, setRestos] = useState([]);
  
  const [quizResponse, setQuizResponse] = useState(null);
  const [allDestinationsWithCoords, setAllDestinationsWithCoords] = useState([]);
  const [transportMode, setTransportMode] = useState('walking');
  const [hotelNights, setHotelNights] = useState([]);
  const [totalNights, setTotalNights] = useState(0);
  const [nbIntensity, setNbIntensity] = useState(1);

  const [plannedActivities, setPlannedActivities] = useState([]);
  const [plannedLieux, setPlannedLieux] = useState([]);
  const [plannedRestaurants, setPlannedRestaurants] = useState([]);

  const planActivitiesAndDestinations = async () => {
    if (hotelNights.length === 0 || allDestinationsWithCoords.length === 0) return;

    // Fonction générique pour planifier un type de destinations
    const planDestinationsByProximity = async (destinations, type) => {
      // Grouper les destinations par hôtel le plus proche
      const destinationsByHotel = {};

      for (let destination of destinations) {
        // Ignorer les destinations sans coordonnées
        if (!destination.lat || !destination.lon) continue;

        let closestHotel = null;
        let minDistance = Infinity;

        for (let hotel of hotelNights) {
          // Vérifier les coordonnées de l'hôtel
          if (!hotel.coordinates || !hotel.coordinates.lat || !hotel.coordinates.lon) {
            console.warn(`Hôtel ${hotel.name} n'a pas de coordonnées valides`);
            continue;
          }

          try {
            const distance = await calculateOSRMDistance(
              { 
                lat: hotel.coordinates.lat, 
                lon: hotel.coordinates.lon 
              },
              { 
                lat: destination.lat, 
                lon: destination.lon 
              },
              transportMode
            );

            if (distance && distance.distance < minDistance) {
              minDistance = distance.distance;
              closestHotel = hotel;
            }
          } catch (error) {
            console.error('Erreur lors du calcul de distance:', error);
          }
        }

        if (closestHotel) {
          if (!destinationsByHotel[closestHotel.name]) {
            destinationsByHotel[closestHotel.name] = {
              hotel: closestHotel,
              destinations: [],
              distances: []
            };
          }
          
          destinationsByHotel[closestHotel.name].destinations.push({
            ...destination,
            distance: minDistance
          });
        }
      }

      const plannedDestinations = [];

      for (let hotelName in destinationsByHotel) {
        const hotelGroup = destinationsByHotel[hotelName];
        const hotel = hotelGroup.hotel;
        const hotelDestinations = hotelGroup.destinations;

        // Trier les destinations par distance
        hotelDestinations.sort((a, b) => a.distance - b.distance);

        // Distribuer toutes les destinations sur les nuits de l'hôtel
        hotelDestinations.forEach((destination, index) => {
          plannedDestinations.push({
            ...destination,
            hotel: hotel.name,
            hotelNights: hotel.nights,
            nightNumber: Math.floor(index / Math.ceil(hotelDestinations.length / hotel.nights)) + 1
          });
        });
      }

      return plannedDestinations;
    };

    const plannedActivitiesList = await planDestinationsByProximity(activites, 'activites');
    const plannedLieuxList = await planDestinationsByProximity(lieux, 'lieux');
    const plannedRestaurantsList = await planDestinationsByProximity(restaurants, 'restaurants');

    // Mettre à jour les états
    setPlannedActivities(plannedActivitiesList || []);
    setPlannedLieux(plannedLieuxList || []);
    setPlannedRestaurants(plannedRestaurantsList || []);

    console.log("PlannedActivities : ", plannedActivitiesList);
    console.log("PlannedLieux : ", plannedLieuxList);
    console.log("PlannedRestos : ", plannedRestaurantsList);
  };

  const determineTransportMode = (transportBudget) => {
    if (transportBudget >= 8) return 'driving';
    if (transportBudget <= 3) return 'bicycle';
    return 'walking';
  };

  const compileDestinationsWithCoordinates = async () => {
    const allDestinations = [];

    // Ajouter les hôtels avec leurs coordonnées existantes ou récupérées
    for (let hotel of hotels) {
      const coordinates = hotel.location?.coordinates || 
        await getCoordinatesFromAddress(hotel.location?.address);
      
      if (coordinates) {
        allDestinations.push({ 
          ...hotel, 
          type: 'hotel',
          lat: coordinates.lat,
          lon: coordinates.lon
        });
      }
    }

    // Récupérer les coordonnées pour les autres destinations
    const fetchCoordinatesForDestinations = async (destinations, type) => {
      for (let destination of destinations) {
        if (destination.location?.address) {
          const coordinates = await getCoordinatesFromAddress(destination.location.address);
          
          if (coordinates) {
            allDestinations.push({
              ...destination,
              type: type,
              lat: coordinates.lat,
              lon: coordinates.lon
            });
          }
        }
      }
    };

    await fetchCoordinatesForDestinations(activites, 'activite');
    await fetchCoordinatesForDestinations(lieux, 'lieu');
    await fetchCoordinatesForDestinations(restaurants, 'restaurant');

    setAllDestinationsWithCoords(allDestinations);
  };

  const planTrip = async () => {
    if (hotels.length > 0 && allDestinationsWithCoords.length > 0) {
      try {
        const proximityHotels = await calculateHotelProximity(hotels, allDestinationsWithCoords, transportMode);
        const nights = distributeNights(proximityHotels, totalNights);
        console.log("Nuits par hotel:", nights); // Debug log
        setHotelNights(nights);
      } catch (error) {
        console.error("Erreur lors de la planification du voyage:", error);
      }
    }
  };

  const fetchLatestQuizResponse = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quiz_responses')
        .select('departure_date, return_date, budget_allocation, day_intensity_preference')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (quizError) {
        console.error("❌ Erreur lors de la récupération de la réponse de quiz:", quizError);
        setError("Impossible de récupérer la réponse de quiz");
        return;
      }

      if (!quizData) {
        console.warn("⚠️ Aucune réponse de quiz trouvée");
        return;
      }

      setQuizResponse(quizData);

      const departureDate = new Date(quizData.departure_date);
      const returnDate = new Date(quizData.return_date);
      const nights = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
      setTotalNights(nights);

      let calculatedNbIntensity = quizData.day_intensity_preference ? 
        Math.floor(quizData.day_intensity_preference / 2) : 1;
      
      // Ensure nb_intensity is at least 1
      calculatedNbIntensity = calculatedNbIntensity === 0 ? 1 : calculatedNbIntensity;
      
      setNbIntensity(calculatedNbIntensity);

      if (quizData.budget_allocation && quizData.budget_allocation.transport) {
        const mode = determineTransportMode(quizData.budget_allocation.transport);
        setTransportMode(mode);
      }
    } catch (err) {
      setError("Erreur lors de la récupération de la réponse de quiz");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const { data: formData, error: formError } = await supabase
        .from('saved_destinations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (formError) {
        console.error("❌ Erreur lors de la récupération des destinations:", formError);
        return;
      }

      if (!formData || formData.length === 0) {
        console.warn("⚠️ Aucune destination trouvée");
        return;
      }

      const latestDestinations = formData[0];

      const logAndSetArray = (data, key, setterFunction) => {
        if (data && Array.isArray(data)) {
          setterFunction(data);
        } else {
          console.warn(`⚠️ ${key} n'est pas un tableau valide`);
          setterFunction([]);
        }
      };

      logAndSetArray(latestDestinations.hotels, 'Hôtels', setHotels);
      logAndSetArray(latestDestinations.activites, 'Activités', setActivites);
      logAndSetArray(latestDestinations.lieux, 'Lieux', setLieux);
      logAndSetArray(latestDestinations.restaurants, 'Restaurants', setRestos);

    } catch (err) {
      setError("Erreur lors de la récupération des destinations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hotelNights.length > 0 && 
        allDestinationsWithCoords.length > 0 &&
        (activites.length > 0 || lieux.length > 0 || restaurants.length > 0)) {
      planActivitiesAndDestinations();
    }
  }, [hotelNights, allDestinationsWithCoords, activites, lieux, restaurants]);

  useEffect(() => {
    fetchLatestQuizResponse();
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (hotels.length > 0 || activites.length > 0 || lieux.length > 0 || restaurants.length > 0) {
      compileDestinationsWithCoordinates();
    }
  }, [hotels, activites, lieux, restaurants]);

  useEffect(() => {
    if (allDestinationsWithCoords.length > 0 && hotels.length > 0 && totalNights > 0) {
      planTrip();
    }
  }, [allDestinationsWithCoords, hotels, totalNights]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Planning de Voyage</h1>
      
      {quizResponse && (
        <div>
          <h2>Détails du Voyage</h2>
          <p>Date de départ: {quizResponse.departure_date}</p>
          <p>Date de retour: {quizResponse.return_date}</p>
          <p>Nombre total de nuits: {totalNights}</p>
          
          <h3>Allocation Budgétaire</h3>
          <ul>
            <li>Activités: {quizResponse.budget_allocation.activites}</li>
            <li>Transport: {quizResponse.budget_allocation.transport}</li>
            <li>Restaurants: {quizResponse.budget_allocation.restaurant}</li>
            <li>Hébergement: {quizResponse.budget_allocation.hebergement}</li>
          </ul>

          <h3>Mode de Transport</h3>
          <p>Mode recommandé : {transportMode}</p>

          <h3>Intensité du Jour</h3>
          <p>Nb Intensité : {nbIntensity}</p>
        </div>
      )}
      {hotelNights.length > 0 && (
        <div>
          <h2>Répartition des Hôtels</h2>
          {hotelNights.map((hotel, index) => (
            <div key={index}>
              <p>{hotel.name} - {hotel.nights} nuits</p>
            </div>
          ))}
        </div>
      )}

      {/* Le reste de votre code reste inchangé */}
      {/* Affichage des planifications */}
      <div>
        <h2>Activités Planifiées</h2>
        {plannedActivities.map((activity, index) => (
          <div key={index}>
            <p>
              {activity.name} - Hôtel: {activity.hotel}, 
              Nuit {activity.nightNumber} / {activity.hotelNights}, 
              Distance: {activity.distance.toFixed(2)} km
            </p>
          </div>
        ))}

        <h2>Lieux Planifiés</h2>
        {plannedLieux.map((lieu, index) => (
          <div key={index}>
            <p>
              {lieu.name} - Hôtel: {lieu.hotel}, 
              Nuit {lieu.nightNumber} / {lieu.hotelNights}, 
              Distance: {lieu.distance.toFixed(2)} km
            </p>
          </div>
        ))}

        <h2>Restaurants Planifiés</h2>
        {plannedRestaurants.map((restaurant, index) => (
          <div key={index}>
            <p>
              {restaurant.name} - Hôtel: {restaurant.hotel}, 
              Nuit {restaurant.nightNumber} / {restaurant.hotelNights}, 
              Distance: {restaurant.distance.toFixed(2)} km
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}