import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const getCoordinatesFromAddress = async (address) => {
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
  const osrmProfiles = {
    'driving': 'driving',
    'walking': 'walking',
    'bicycle': 'cycling'
  };

  const baseUrl = 'https://router.project-osrm.org/route/v1';
  const profile = osrmProfiles[transportMode] || 'driving';
  
  try {
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
      coordinates: hotel.location.coordinates || 
                   await getCoordinatesFromAddress(hotel.location.address)
    }))
  );

  // Filtrer les hôtels avec des coordonnées valides
  const validHotels = hotelsWithCoords.filter(
    hotel => hotel.coordinates?.lat && hotel.coordinates?.lon
  );

  // Initialiser le compteur de destinations
  validHotels.forEach(hotel => hotel.destinationCounter = 0);

  // Calculer la proximité
  for (let destination of allDestinations) {
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
      destination.nom_hotel = closestHotel.name;
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

const assignHotelNights = (hotels, totalNights, startDate) => {
    // Vérifier que les données sont valides
    if (!hotels || hotels.length === 0) {
      console.error("Aucun hôtel disponible");
      return [];
    }
  
    // Convertir la date de départ en objet Date si ce n'est pas déjà le cas
    const tripStartDate = new Date(startDate);
  
    // Répartir les nuits entre les hôtels
    const hotelNightsWithDates = hotels.map((hotel, index) => {
      // Calculer les dates de début et de fin pour cet hôtel
      const hotelStartDate = new Date(tripStartDate);
      hotelStartDate.setDate(tripStartDate.getDate() + 
        (index > 0 
          ? hotels.slice(0, index).reduce((total, h) => total + h.nights, 0) 
          : 0)
      );
  
      const hotelEndDate = new Date(hotelStartDate);
      hotelEndDate.setDate(hotelStartDate.getDate() + hotel.nights - 1);
  
      return {
        ...hotel,
        startDate: hotelStartDate.toISOString().split('T')[0],
        endDate: hotelEndDate.toISOString().split('T')[0]
      };
    });
  
    return hotelNightsWithDates;
  };
  

export default function PlanningPage() {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [activites, setActivites] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [restaurants, setRestos] = useState([]);
  const [nbIntensity, setNbIntensity] = useState(1); // New state for nb_intensity
  const [quizResponse, setQuizResponse] = useState(null);
  const [allDestinationsWithCoords, setAllDestinationsWithCoords] = useState([]);
  const [transportMode, setTransportMode] = useState('walking');
  const [hotelNights, setHotelNights] = useState([]);
  const [totalNights, setTotalNights] = useState(0);
  const [hotelsWithDates, setHotelsWithDates] = useState([]);

  const determineTransportMode = (transportBudget) => {
    if (transportBudget >= 8) return 'driving';
    if (transportBudget <= 3) return 'bicycle';
    return 'walking';
  };

  const getCoordinatesFromAddress = async (address) => {
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

  const compileDestinationsWithCoordinates = async () => {
    const allDestinations = [
      ...hotels.map(hotel => ({ 
        ...hotel, 
        type: 'hotel',
        lat: hotel.location.coordinates?.lat,
        lon: hotel.location.coordinates?.lon
      })),
      ...activites.map(activite => ({ 
        ...activite, 
        type: 'activite' 
      })),
      ...lieux.map(lieu => ({ 
        ...lieu, 
        type: 'lieu' 
      })),
      ...restaurants.map(restaurant => ({ 
        ...restaurant, 
        type: 'restaurant' 
      }))
    ];

    const destinationsWithCoords = [];

    for (let destination of allDestinations) {
      // Pour les hôtels, utiliser les coordonnées existantes ou récupérées
      if (destination.type === 'hotel' && destination.lat && destination.lon) {
        destinationsWithCoords.push(destination);
        continue;
      }

      // Pour les autres types, récupérer les coordonnées
      if (destination.location?.address) {
        try {
          const coordinates = await getCoordinatesFromAddress(destination.location.address);
          
          if (coordinates && coordinates.lat && coordinates.lon) {
            destinationsWithCoords.push({
              ...destination,
              lat: coordinates.lat,
              lon: coordinates.lon
            });
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des coordonnées pour ${destination.name}:`, error);
        }
      }
    }

    setAllDestinationsWithCoords(destinationsWithCoords);
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

      // Calculate nb_intensity
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


  useEffect(() => {
    if (hotelNights.length > 0 && quizResponse) {
      const hotelsWithDateRanges = assignHotelNights(
        hotelNights, 
        totalNights, 
        quizResponse.departure_date
      );
      
      // Stockez les hôtels avec leurs dates
      setHotelsWithDates(hotelsWithDateRanges);
  
      // Mettez à jour allDestinationsWithCoords avec les informations d'hôtel
      const updatedDestinations = allDestinationsWithCoords.map(destination => {
        // Trouvez l'hôtel correspondant
        const hotel = hotelsWithDateRanges.find(h => h.name === destination.nom_hotel);
        
        return {
          ...destination,
          hotelStartDate: hotel ? hotel.startDate : null,
          hotelEndDate: hotel ? hotel.endDate : null
        };
      });
  
      setAllDestinationsWithCoords(updatedDestinations);
    }
  }, [hotelNights, quizResponse]);

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
          <p>Nb Intensité : {nbIntensity}</p>

          <h3>Allocation Budgétaire</h3>
          <ul>
            <li>Activités: {quizResponse.budget_allocation.activites}</li>
            <li>Transport: {quizResponse.budget_allocation.transport}</li>
            <li>Restaurants: {quizResponse.budget_allocation.restaurant}</li>
            <li>Hébergement: {quizResponse.budget_allocation.hebergement}</li>
          </ul>

          <h3>Mode de Transport</h3>
          <p>Mode recommandé : {transportMode}</p>
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
      {/* Affichage des hôtels avec leurs dates */}
    <h2>Répartition des Hôtels</h2>
    {hotelsWithDates.map((hotel, index) => (
      <div key={index}>
        <p>
          {hotel.name} - {hotel.nights} nuits 
          (Du {hotel.startDate} au {hotel.endDate})
        </p>
      </div>
    ))}

    {/* Affichage des destinations avec leurs hôtels et dates */}
    <h2>Répartition des Destinations</h2>
    {allDestinationsWithCoords.map((destination, index) => (
      <div key={index}>
        <p>
          Destination : {destination.name} 
          - Hôtel : {destination.nom_hotel}
          {destination.hotelStartDate && destination.hotelEndDate && (
            ` (Période de l'hôtel: ${destination.hotelStartDate} - ${destination.hotelEndDate})`
          )}
        </p>
      </div>
    ))}
    </div>
  );
}