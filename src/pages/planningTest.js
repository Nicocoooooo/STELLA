import { useEffect, useState, useRef } from 'react';
import supabase from '../supabaseClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/Planning.css';
import MapView from '../components/MapView';

// Fonctions utilitaires pour la géolocalisation
const getCoordinatesFromAddress = async (address) => {
  if (!address) {
    console.warn("Adresse vide ou invalide");
    return null;
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

  try {
    // Ajouter un délai pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } else {
      console.warn(`Adresse introuvable pour : ${address}`);
      return null;
    }
  } catch (err) {
    console.warn("Erreur Nominatim", err);
    return null;
  }
};

// Fonctions pour le calcul des distances
const calculateOSRMDistance = async (startCoord, endCoord, transportMode) => {
  if (!startCoord?.lat || !startCoord?.lon || !endCoord?.lat || !endCoord?.lon) {
    console.warn("Coordonnées manquantes pour le calcul de distance");
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
    // Ajouter un délai pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 500));

    const url = `${baseUrl}/${profile}/${startCoord.lon},${startCoord.lat};${endCoord.lon},${endCoord.lat}?overview=false`;

    const response = await fetch(url);

    if (!response.ok) {
      console.warn('Erreur OSRM:', response.statusText);
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
    console.warn('Erreur lors du calcul de distance OSRM:', error);
    return null;
  }
};

// Fonctions pour calculer la proximité des hôtels par rapport aux destinations
const calculateHotelProximity = async (hotels, allDestinations, transportMode) => {
  if (!hotels || hotels.length === 0 || !allDestinations || allDestinations.length === 0) {
    console.warn("Données insuffisantes pour calculer la proximité des hôtels");
    return [];
  }

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

  if (validHotels.length === 0) {
    console.warn("Aucun hôtel avec des coordonnées valides");
    return [];
  }

  // Initialiser le compteur de destinations
  validHotels.forEach(hotel => hotel.destinationCounter = 0);

  // Filtrer les destinations avec des coordonnées valides
  const validDestinations = allDestinations.filter(
    dest => dest.lat && dest.lon
  );

  if (validDestinations.length === 0) {
    console.warn("Aucune destination avec des coordonnées valides");
    return validHotels;
  }

  // Calculer la proximité
  for (let destination of validDestinations) {
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
        console.warn('Erreur lors du calcul de distance:', error);
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

// Fonction pour distribuer les nuits entre les hôtels
const distributeNights = (hotels, totalNights) => {
  if (!hotels || hotels.length === 0 || !totalNights || totalNights <= 0) {
    console.warn("Données insuffisantes pour distribuer les nuits");
    return [];
  }

  // Si aucun hôtel n'a de compteur, distribuer également
  if (hotels.every(hotel => !hotel.destinationCounter || hotel.destinationCounter === 0)) {
    const nightsPerHotel = Math.floor(totalNights / hotels.length);
    const remainder = totalNights % hotels.length;

    return hotels.map((hotel, index) => ({
      ...hotel,
      nights: nightsPerHotel + (index < remainder ? 1 : 0)
    }));
  }

  // Limiter le nombre d'hôtels au nombre de nuits
  const limitedHotels = hotels.slice(0, Math.min(hotels.length, totalNights));

  // Calculer le total des compteurs
  const totalCounter = limitedHotels.reduce((sum, hotel) => sum + (hotel.destinationCounter || 0), 0);

  if (totalCounter === 0) {
    // Fallback si tous les compteurs sont à 0
    return limitedHotels.map((hotel, index) => ({
      ...hotel,
      nights: index === 0 ? totalNights : 0
    }));
  }

  // Répartir les nuits proportionnellement
  const hotelNights = limitedHotels.map(hotel => {
    const proportionalNights = Math.max(
      1,
      Math.round(((hotel.destinationCounter || 0) / totalCounter) * totalNights)
    );
    return {
      ...hotel,
      nights: proportionalNights
    };
  });

  // Ajuster pour correspondre exactement au nombre total de nuits
  const currentTotalNights = hotelNights.reduce((sum, hotel) => sum + hotel.nights, 0);
  if (currentTotalNights !== totalNights && hotelNights.length > 0) {
    const diff = totalNights - currentTotalNights;
    hotelNights[0].nights += diff;
  }

  return hotelNights;
};

// Fonction pour assigner des dates aux séjours dans les hôtels
const assignHotelNights = (hotels, totalNights, startDate) => {
  // Vérifier que les données sont valides
  if (!hotels || hotels.length === 0 || !startDate) {
    console.warn("Données insuffisantes pour assigner les nuits aux hôtels");
    return [];
  }

  // Convertir la date de départ en objet Date
  const tripStartDate = new Date(startDate);
  if (isNaN(tripStartDate.getTime())) {
    console.warn("Date de départ invalide");
    return hotels;
  }

  // Répartir les nuits entre les hôtels
  const hotelNightsWithDates = hotels.map((hotel, index) => {
    // Calculer les dates de début et de fin pour cet hôtel
    const hotelStartDate = new Date(tripStartDate);
    hotelStartDate.setDate(tripStartDate.getDate() +
      (index > 0
        ? hotels.slice(0, index).reduce((total, h) => total + (h.nights || 0), 0)
        : 0)
    );

    const hotelEndDate = new Date(hotelStartDate);
    hotelEndDate.setDate(hotelStartDate.getDate() + (hotel.nights || 1) - 1);

    return {
      ...hotel,
      startDate: hotelStartDate.toISOString().split('T')[0],
      endDate: hotelEndDate.toISOString().split('T')[0]
    };
  });

  return hotelNightsWithDates;
};

// Fonction pour vérifier si c'est le premier jour dans un hôtel
function estPremierJourHotel(date, hotel, dailyPlanning) {
  // Validation des paramètres
  if (!date || !hotel || !dailyPlanning || !Array.isArray(dailyPlanning) || dailyPlanning.length === 0) {
    return false;
  }

  try {
    // Cloner et trier le planning par date
    const planningSorted = [...dailyPlanning].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    // Trouver l'index du jour actuel
    const currentDayIndex = planningSorted.findIndex(day =>
      day.date === date && day.hotel === hotel
    );

    // Si le jour n'est pas trouvé
    if (currentDayIndex === -1) {
      return false;
    }

    // Si c'est le premier jour du planning, c'est forcément un premier jour d'hôtel
    if (currentDayIndex === 0) {
      return true;
    }

    // Vérifier si le jour précédent était dans un autre hôtel
    const jourPrecedent = planningSorted[currentDayIndex - 1];

    // Si le jour précédent était dans un autre hôtel, c'est un premier jour
    return jourPrecedent.hotel !== hotel;
  } catch (error) {
    console.error("Erreur lors de la vérification du premier jour d'hôtel:", error);
    return false;
  }
}

// Fonction pour assigner les destinations aux différents jours du séjour
const assignDaysToDestinations = (destinations, hotelsWithDates, nbIntensity) => {
  if (!destinations || destinations.length === 0 || !hotelsWithDates || hotelsWithDates.length === 0) {
    console.warn("Données insuffisantes pour assigner des jours aux destinations");
    return { destinationsWithDates: [], dailyPlanning: [] };
  }

  // Ne travailler qu'avec les destinations non-hôtels
  const destinationsToAssign = [...destinations].filter(dest => dest.type !== 'hotel');

  // Préparation du planning: créer un objet avec chaque date et ses destinations
  const dailyPlanning = {};

  // Créer une plage de dates pour chaque jour du voyage
  hotelsWithDates.forEach(hotel => {
    if (!hotel.startDate || !hotel.endDate) return;

    const start = new Date(hotel.startDate);
    const end = new Date(hotel.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    // Pour chaque jour de l'intervalle
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const dateStr = day.toISOString().split('T')[0];

      // Initialiser l'entrée pour ce jour s'il n'existe pas encore
      if (!dailyPlanning[dateStr]) {
        dailyPlanning[dateStr] = {
          date: dateStr,
          hotel: hotel.name,
          destinations: [],
          count: 0
        };
      }
    }
  });

  // Trier les destinations par hôtel
  const destinationsByHotel = {};

  destinationsToAssign.forEach(destination => {
    const hotelName = destination.nom_hotel || "Non assigné";
    if (!destinationsByHotel[hotelName]) {
      destinationsByHotel[hotelName] = [];
    }
    destinationsByHotel[hotelName].push(destination);
  });

  // Pour chaque hôtel, répartir ses destinations sur les jours associés
  Object.keys(destinationsByHotel).forEach(hotelName => {
    if (hotelName === "Non assigné") return; // Ignorer les destinations sans hôtel

    const hotel = hotelsWithDates.find(h => h.name === hotelName);
    if (!hotel || !hotel.startDate || !hotel.endDate) return;

    const hotelDestinations = destinationsByHotel[hotelName];
    const hotelDates = [];

    // Récupérer toutes les dates pour cet hôtel
    const start = new Date(hotel.startDate);
    const end = new Date(hotel.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      hotelDates.push(day.toISOString().split('T')[0]);
    }

    if (hotelDates.length === 0) return; // Sécurité

    // Trier les destinations par type pour une meilleure répartition
    const sortedDestinations = hotelDestinations.sort((a, b) => {
      const typeOrder = { activite: 0, lieu: 1, restaurant: 2 };
      return (typeOrder[a.type] || 3) - (typeOrder[b.type] || 3);
    });

    // Nombre total de destinations pour cet hôtel
    const totalDestinations = sortedDestinations.length;

    // Nombre de jours disponibles pour cet hôtel
    const daysAvailable = hotelDates.length;

    // Calculer la meilleure distribution
    const destinationsPerDay = Math.ceil(totalDestinations / daysAvailable);
    const intensityPerDay = Math.min(destinationsPerDay, nbIntensity || 1);

    // Structure pour suivre le nombre de destinations assignées par jour
    const dayAssignmentCount = {};
    hotelDates.forEach(date => {
      dayAssignmentCount[date] = 0;
    });

    // Répartir les destinations sur les jours disponibles de manière équilibrée
    for (let i = 0; i < sortedDestinations.length; i++) {
      // Trouver le jour avec le moins de destinations assignées
      let minAssignments = Infinity;
      let dateToAssign = null;

      for (const date of hotelDates) {
        if (dayAssignmentCount[date] < minAssignments &&
          dayAssignmentCount[date] < intensityPerDay) {
          minAssignments = dayAssignmentCount[date];
          dateToAssign = date;
        }
      }

      // Si tous les jours ont atteint la limite d'intensité, on recommence et on incrémente l'intensité
      if (!dateToAssign) {
        // Essayer de trouver le jour avec le moins de destinations
        for (const date of hotelDates) {
          if (!dateToAssign || dayAssignmentCount[date] < dayAssignmentCount[dateToAssign]) {
            dateToAssign = date;
          }
        }
      }

      // Ajouter la destination au planning de ce jour
      if (dateToAssign && dailyPlanning[dateToAssign]) {
        dailyPlanning[dateToAssign].destinations.push({
          ...sortedDestinations[i],
          visitDate: dateToAssign
        });
        dailyPlanning[dateToAssign].count++;
        dayAssignmentCount[dateToAssign]++;
      }
    }
  });

  // Convertir le planning quotidien en tableau
  const dailyPlanningArray = Object.values(dailyPlanning);

  // Ajouter la date de visite à chaque destination
  const destinationsWithDates = destinationsToAssign.map(dest => {
    // Trouver le jour où cette destination est planifiée
    for (const day of dailyPlanningArray) {
      const found = day.destinations.find(d => d.name === dest.name && d.type === dest.type);
      if (found) {
        return {
          ...dest,
          visitDate: found.visitDate
        };
      }
    }
    return dest;
  });

  return {
    destinationsWithDates,
    dailyPlanning: dailyPlanningArray
  };
};

// Fonction pour assigner des horaires aux destinations
const assignTimeToDestinations = (dailyPlanning, gastronomieHoraires) => {
  if (!dailyPlanning || !dailyPlanning.length) {
    console.warn("Données insuffisantes pour assigner des horaires");
    return dailyPlanning;
  }

  // Extraire les horaires de repas
  let petitDejeuner = { debut: "7:00", fin: "9:00" };  // Valeurs par défaut
  let dejeuner = { debut: "12:00", fin: "14:00" };
  let diner = { debut: "19:00", fin: "21:00" };

  // Rechercher les horaires corrects dans gastronomieHoraires
  if (Array.isArray(gastronomieHoraires)) {
    for (const repas of gastronomieHoraires) {
      if (typeof repas === 'object') {
        if (repas.type === 'petit_dejeuner' && repas.horaire) {
          petitDejeuner = extraireHeures(repas.horaire);
        } else if (repas.type === 'dejeuner' && repas.horaire) {
          dejeuner = extraireHeures(repas.horaire);
        } else if (repas.type === 'diner' && repas.horaire) {
          diner = extraireHeures(repas.horaire);
        }
      }
    }
  }

  // Standardiser les horaires au format 24h
  petitDejeuner = standardiserHoraires(petitDejeuner);
  dejeuner = standardiserHoraires(dejeuner);
  diner = standardiserHoraires(diner);

  // Clone du planning pour modification
  const planningWithTimes = JSON.parse(JSON.stringify(dailyPlanning));

  // Pour chaque jour du planning
  for (const day of planningWithTimes) {
    if (!day.destinations || !day.destinations.length) continue;

    // Vérifier si c'est le premier jour dans cet hôtel
    const estPremierJour = estPremierJourHotel(day.date, day.hotel, planningWithTimes);

    // Décalage à appliquer si c'est le premier jour (30 minutes = 30)
    const decalage = estPremierJour ? 30 : 0;

    // Définir les plages horaires de la journée
    const debutJournee = convertirEnMinutes(petitDejeuner.fin);
    const finJournee = convertirEnMinutes(diner.debut);
    const millieuJournee = convertirEnMinutes(dejeuner.debut);

    // Séparer les destinations en catégories
    const hotels = [];
    const restaurants = [];
    const activitesEtLieux = [];

    for (const dest of day.destinations) {
      if (dest.type === 'hotel') {
        hotels.push(dest);
      } else if (dest.type === 'restaurant') {
        restaurants.push(dest);
      } else {
        activitesEtLieux.push(dest);
      }
    }

    // Déterminer le nombre de destinations pour matin et après-midi
    const totalActivites = activitesEtLieux.length;
    let activitesMatin = Math.floor(totalActivites / 2);
    let activitesAprem = totalActivites - activitesMatin;

    // Si nombre impair, privilégier l'après-midi
    if (totalActivites % 2 !== 0 && activitesMatin === activitesAprem) {
      activitesMatin -= 1;
      activitesAprem += 1;
    }

    // Assigner les horaires aux restaurants
    for (const resto of restaurants) {
      // Assigner au déjeuner par défaut
      let debut = convertirEnMinutes(dejeuner.debut);
      let fin = convertirEnMinutes(dejeuner.fin);

      // Si déjà un restaurant au déjeuner, assigner au dîner
      const dejaDejeunner = restaurants.some(r =>
        r !== resto && r.heureDebut &&
        r.heureDebut >= convertirEnMinutes(dejeuner.debut) &&
        r.heureDebut < convertirEnMinutes(dejeuner.fin)
      );

      if (dejaDejeunner) {
        debut = convertirEnMinutes(diner.debut);
        fin = convertirEnMinutes(diner.fin);
      }

      // Assigner les horaires (minimum 1 heure)
      resto.heureDebut = debut;
      resto.heureFin = fin;
      resto.heureDebutStr = convertirEnHeure(debut);
      resto.heureFinStr = convertirEnHeure(fin);
    }

    // Assigner les horaires aux activités du matin
    if (activitesMatin > 0) {
      const dureeParActivite = Math.max(60, Math.floor((millieuJournee - debutJournee) / activitesMatin));

      for (let i = 0; i < activitesMatin; i++) {
        const activite = activitesEtLieux[i];
        const debut = debutJournee + (i * dureeParActivite);
        const fin = Math.min(debut + dureeParActivite, millieuJournee);

        activite.heureDebut = debut;
        activite.heureFin = fin;
        activite.heureDebutStr = convertirEnHeure(debut);
        activite.heureFinStr = convertirEnHeure(fin);
      }
    }

    // Assigner les horaires aux activités de l'après-midi
    if (activitesAprem > 0) {
      const debutAprem = convertirEnMinutes(dejeuner.fin);
      const dureeParActivite = Math.max(60, Math.floor((finJournee - debutAprem) / activitesAprem));

      for (let i = 0; i < activitesAprem; i++) {
        const activite = activitesEtLieux[i + activitesMatin];
        const debut = debutAprem + (i * dureeParActivite);
        const fin = Math.min(debut + dureeParActivite, finJournee);

        activite.heureDebut = debut;
        activite.heureFin = fin;
        activite.heureDebutStr = convertirEnHeure(debut);
        activite.heureFinStr = convertirEnHeure(fin);
      }
    }
  }

  return planningWithTimes;
};

// Fonctions utilitaires pour les horaires
function extraireHeures(horaire) {
  if (!horaire) return { debut: "00:00", fin: "00:00" };

  // Rechercher des formats comme "7h - 10h", "7:00 - 10:00", etc.
  const regex = /(\d{1,2})[h:](\d{0,2})\s*-\s*(\d{1,2})[h:](\d{0,2})/;
  const match = horaire.match(regex);

  if (match) {
    return {
      debut: `${match[1]}:${match[2] || '00'}`,
      fin: `${match[3]}:${match[4] || '00'}`
    };
  } else {
    // Si format non reconnu, chercher simplement deux nombres
    const nombres = horaire.match(/\d{1,2}/g);
    if (nombres && nombres.length >= 2) {
      return {
        debut: `${nombres[0]}:00`,
        fin: `${nombres[1]}:00`
      };
    }
  }

  return { debut: "00:00", fin: "00:00" };
}

function standardiserHoraires(horaires) {
  const standardiser = (heure) => {
    const [h, m] = heure.split(':').map(Number);
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
  };

  return {
    debut: standardiser(horaires.debut),
    fin: standardiser(horaires.fin)
  };
}

function convertirEnMinutes(heure) {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

function convertirEnHeure(minutes) {
  const heures = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${heures < 10 ? '0' + heures : heures}:${mins < 10 ? '0' + mins : mins}`;
}

// Fonction pour calculer les itinéraires entre les destinations
const calculateRoutesBetweenDestinations = async (dailyPlanning, transportMode, allDestinationsWithCoords) => {
  if (!dailyPlanning || !dailyPlanning.length) {
    console.warn("Données insuffisantes pour calculer les trajets");
    return dailyPlanning;
  }

  // Clone du planning pour modification
  const planningWithRoutes = JSON.parse(JSON.stringify(dailyPlanning));

  // Pour chaque jour du planning
  for (const day of planningWithRoutes) {
    // Vérifier s'il y a des destinations
    if (!day.destinations || day.destinations.length === 0) continue;

    // Trier les destinations par heure de début
    const sortedDestinations = [...day.destinations]
      .filter(dest => dest.heureDebut !== undefined && !isNaN(dest.heureDebut))
      .sort((a, b) => a.heureDebut - b.heureDebut);

    // S'il n'y a pas de destinations triables, continuer avec la journée suivante
    if (sortedDestinations.length === 0) continue;

    // Ajouter l'hôtel comme point de départ et de retour
    const hotel = day.destinations.find(dest => dest.type === 'hotel') ||
      { name: day.hotel, type: 'hotel' };

    const hotelLocation = await getHotelCoordinates(hotel.name, day.hotel, allDestinationsWithCoords);

    if (!hotelLocation) {
      console.warn(`Coordonnées introuvables pour l'hôtel: ${day.hotel}`);
      continue;
    }

    // Calculer les trajets entre chaque destination consécutive
    for (let i = 0; i < sortedDestinations.length; i++) {
      const currentDest = sortedDestinations[i];

      // Pour le premier trajet : de l'hôtel à la première destination
      if (i === 0) {
        const route = await calculateRoute(
          hotelLocation,
          { lat: currentDest.lat, lon: currentDest.lon },
          transportMode
        );

        if (route) {
          currentDest.routeFromPrevious = route;
          currentDest.previousLocation = "Hôtel";

          // Ajuster l'heure de début en fonction du temps de trajet
          const debutAvecTrajet = currentDest.heureDebut - route.duration;
          currentDest.departHotel = Math.max(0, debutAvecTrajet);
          currentDest.departHotelStr = convertirEnHeure(currentDest.departHotel);
        }
      }

      // Pour les trajets intermédiaires : entre deux destinations consécutives
      if (i < sortedDestinations.length - 1) {
        const nextDest = sortedDestinations[i + 1];

        const route = await calculateRoute(
          { lat: currentDest.lat, lon: currentDest.lon },
          { lat: nextDest.lat, lon: nextDest.lon },
          transportMode
        );

        if (route) {
          nextDest.routeFromPrevious = route;
          nextDest.previousLocation = currentDest.name;

          // Ajuster l'heure de début de la destination suivante
          const tempsFinActivitePlusDeplacement = currentDest.heureFin + route.duration;

          if (tempsFinActivitePlusDeplacement > nextDest.heureDebut) {
            // Pas assez de temps, ajuster l'heure de début de la prochaine destination
            const nouvelleHeureDebut = tempsFinActivitePlusDeplacement;
            const decalage = nouvelleHeureDebut - nextDest.heureDebut;

            nextDest.heureDebut = nouvelleHeureDebut;
            nextDest.heureFin += decalage; // Déplacer également l'heure de fin
            nextDest.heureDebutStr = convertirEnHeure(nextDest.heureDebut);
            nextDest.heureFinStr = convertirEnHeure(nextDest.heureFin);
          }

          // Ajouter l'heure de départ de la destination précédente
          nextDest.departPrevious = currentDest.heureFin;
          nextDest.departPreviousStr = convertirEnHeure(nextDest.departPrevious);
        }
      }

      // Pour la dernière destination : retour à l'hôtel
      if (i === sortedDestinations.length - 1) {
        const route = await calculateRoute(
          { lat: currentDest.lat, lon: currentDest.lon },
          hotelLocation,
          transportMode
        );

        if (route) {
          currentDest.routeToHotel = route;
          currentDest.retourHotel = currentDest.heureFin + route.duration;
          currentDest.retourHotelStr = convertirEnHeure(currentDest.retourHotel);
        }
      }
    }

    // Mettre à jour les destinations dans le planning
    const destinationsMap = new Map();
    sortedDestinations.forEach(dest => {
      destinationsMap.set(dest.name, dest);
    });

    // Remplacer les destinations dans le tableau original par les versions mises à jour
    day.destinations = day.destinations.map(dest =>
      destinationsMap.has(dest.name) ? destinationsMap.get(dest.name) : dest
    );
  }

  return planningWithRoutes;
};

// Fonction pour obtenir les coordonnées d'un hôtel
async function getHotelCoordinates(hotelName, fallbackName, allDestinations) {
  // D'abord, essayer de trouver l'hôtel dans les destinations fournies
  const hotel = allDestinations.find(
    dest => dest.type === 'hotel' && (dest.name === hotelName || dest.name === fallbackName)
  );

  if (hotel && hotel.lat && hotel.lon) {
    return { lat: hotel.lat, lon: hotel.lon };
  }

  // Si non trouvé, essayer de récupérer les coordonnées via l'API
  const hotelAddress = hotelName || fallbackName;
  if (hotelAddress) {
    try {
      const coordinates = await getCoordinatesFromAddress(hotelAddress);
      if (coordinates && coordinates.lat && coordinates.lon) {
        return coordinates;
      }
    } catch (error) {
      console.warn(`Erreur lors de la récupération des coordonnées pour ${hotelAddress}:`, error);
    }
  }

  return null;
}

// Fonction pour calculer un itinéraire entre deux points
async function calculateRoute(startCoord, endCoord, transportMode) {
  if (!startCoord?.lat || !startCoord?.lon || !endCoord?.lat || !endCoord?.lon) {
    console.warn("Coordonnées manquantes pour le calcul d'itinéraire");
    return null;
  }

  try {
    const distance = await calculateOSRMDistance(startCoord, endCoord, transportMode);

    if (distance) {
      return {
        distance: distance.distance, // en km
        duration: Math.ceil(distance.duration), // en minutes, arrondi à la minute supérieure
        mode: transportMode
      };
    }

    return null;
  } catch (error) {
    console.warn('Erreur lors du calcul d\'itinéraire:', error);
    return null;
  }
}

// Générer des événements de repas pour le planning
const generateMealEvents = (dailyPlanning, gastronomieHoraires) => {
  if (!dailyPlanning || !dailyPlanning.length) {
    console.warn("Données manquantes pour générer les événements de repas");
    return [];
  }

  // Extraire les horaires de repas avec des valeurs par défaut
  let petitDejeuner = { debut: "07:00", fin: "09:00" };
  let dejeuner = { debut: "12:00", fin: "14:00" };
  let diner = { debut: "19:00", fin: "21:00" };

  // Rechercher les horaires dans gastronomieHoraires
  if (Array.isArray(gastronomieHoraires)) {
    for (const repas of gastronomieHoraires) {
      if (typeof repas === 'object') {
        if (repas.type === 'petit_dejeuner' && repas.horaire) {
          petitDejeuner = extraireHeures(repas.horaire);
        } else if (repas.type === 'dejeuner' && repas.horaire) {
          dejeuner = extraireHeures(repas.horaire);
        } else if (repas.type === 'diner' && repas.horaire) {
          diner = extraireHeures(repas.horaire);
        }
      }
    }
  } else if (typeof gastronomieHoraires === 'object') {
    // Alternative si gastronomieHoraires est un objet et non un tableau
    if (gastronomieHoraires.petit_dejeuner) {
      petitDejeuner = extraireHeures(gastronomieHoraires.petit_dejeuner);
    }
    if (gastronomieHoraires.dejeuner) {
      dejeuner = extraireHeures(gastronomieHoraires.dejeuner);
    }
    if (gastronomieHoraires.diner) {
      diner = extraireHeures(gastronomieHoraires.diner);
    }
  }

  // Standardiser les horaires au format 24h
  petitDejeuner = standardiserHoraires(petitDejeuner);
  dejeuner = standardiserHoraires(dejeuner);
  diner = standardiserHoraires(diner);

  const mealEvents = [];
  const dates = dailyPlanning
    .map(day => day.date)
    .filter(date => date)
    .sort((a, b) => new Date(a) - new Date(b));

  if (dates.length === 0) return [];

  // Pour chaque jour de voyage
  for (const date of dates) {
    try {
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.warn(`Format de date invalide: ${date}`);
        continue;
      }

      // Récupérer le planning pour cette journée
      const dayPlan = dailyPlanning.find(day => day.date === date);

      if (!dayPlan || !dayPlan.destinations) continue;

      // Vérifier si c'est le premier jour dans cet hôtel
      const estPremierJour = estPremierJourHotel(date, dayPlan.hotel, dailyPlanning);

      // Décalage à appliquer si c'est le premier jour (30 minutes)
      const decalage = estPremierJour ? 30 : 0;

      // Vérifier les restaurants programmés pour cette journée
      const restaurantsForDay = dayPlan.destinations.filter(dest => dest.type === 'restaurant');

      // Fonction pour vérifier si un restaurant est programmé pendant un créneau de repas
      const hasRestaurantDuring = (mealStart, mealEnd) => {
        return restaurantsForDay.some(resto => {
          if (!resto.heureDebutStr || !resto.heureFinStr) return false;
          const restoStart = convertirEnMinutes(resto.heureDebutStr);
          const restoEnd = convertirEnMinutes(resto.heureFinStr);
          const mealStartMin = convertirEnMinutes(mealStart);
          const mealEndMin = convertirEnMinutes(mealEnd);
          return !(restoEnd <= mealStartMin || restoStart >= mealEndMin);
        });
      };

      // Ajuster les horaires en fonction du décalage
      const ajusterHeure = (heure, minutesAjoutees) => {
        const [heures, minutes] = heure.split(':').map(Number);
        const totalMinutes = heures * 60 + minutes - minutesAjoutees;
        const nouvellesHeures = Math.floor(totalMinutes / 60);
        const nouveauxMinutes = totalMinutes % 60;
        return `${String(nouvellesHeures).padStart(2, '0')}:${String(nouveauxMinutes).padStart(2, '0')}`;
      };

      // Petit déjeuner
      if (!hasRestaurantDuring(petitDejeuner.debut, petitDejeuner.fin)) {
        const debutDejeuner = estPremierJour ? ajusterHeure(petitDejeuner.debut, decalage) : petitDejeuner.debut;
        const finDejeuner = estPremierJour ? ajusterHeure(petitDejeuner.fin, decalage) : petitDejeuner.fin;

        mealEvents.push({
          title: '🍳 Petit déjeuner',
          start: `${date}T${debutDejeuner}`,
          end: `${date}T${finDejeuner}`,
          backgroundColor: '#fa9b3d',
          borderColor: '#FFA000',
          textColor: '#000000',
          extendedProps: {
            type: 'repas',
            repasType: 'petit-dejeuner'
          },
          allDay: false
        });
      }

      // Déjeuner
      if (!hasRestaurantDuring(dejeuner.debut, dejeuner.fin)) {
        const debutDejeuner = estPremierJour ? ajusterHeure(dejeuner.debut, decalage) : dejeuner.debut;
        const finDejeuner = estPremierJour ? ajusterHeure(dejeuner.fin, decalage) : dejeuner.fin;

        mealEvents.push({
          title: '🍽️ Déjeuner',
          start: `${date}T${debutDejeuner}`,
          end: `${date}T${finDejeuner}`,
          backgroundColor: '#E64A19',
          borderColor: '#E64A19',
          textColor: '#FFFFFF',
          extendedProps: {
            type: 'repas',
            repasType: 'dejeuner'
          },
          allDay: false
        });
      }

      // Dîner
      if (!hasRestaurantDuring(diner.debut, diner.fin)) {
        const debutDiner = estPremierJour ? ajusterHeure(diner.debut, decalage) : diner.debut;
        const finDiner = estPremierJour ? ajusterHeure(diner.fin, decalage) : diner.fin;

        mealEvents.push({
          title: '🍷 Dîner',
          start: `${date}T${debutDiner}`,
          end: `${date}T${finDiner}`,
          backgroundColor: '#9557fa',
          borderColor: '#7B1FA2',
          textColor: '#FFFFFF',
          extendedProps: {
            type: 'repas',
            repasType: 'diner'
          },
          allDay: false
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la création des événements de repas pour la date ${date}:`, error);
    }
  }

  return mealEvents;
};

// Fonction pour générer un lien Google Maps pour un itinéraire optimisé
const generateOptimizedItinerary = (dayPlan, transportMode, allDestinations) => {
  if (!dayPlan || !dayPlan.destinations || dayPlan.destinations.length === 0) {
    return { url: "#", count: 0, duration: 0, distance: 0 };
  }

  // Récupérer les coordonnées de l'hôtel
  let hotelCoords = null;
  // Chercher l'hôtel dans toutes les destinations
  const hotel = allDestinations.find(
    dest => dest.type === 'hotel' && dest.name === dayPlan.hotel
  );
  if (hotel && hotel.lat && hotel.lon) {
    hotelCoords = { lat: hotel.lat, lon: hotel.lon };
  }

  // Si on n'a pas trouvé les coordonnées de l'hôtel, on essaie de les récupérer autrement
  if (!hotelCoords) {
    const hotelDest = dayPlan.destinations.find(dest => dest.type === 'hotel');
    if (hotelDest && hotelDest.lat && hotelDest.lon) {
      hotelCoords = { lat: hotelDest.lat, lon: hotelDest.lon };
    } else {
      console.warn(`Coordonnées introuvables pour l'hôtel: ${dayPlan.hotel}`);
      return { url: "#", count: 0, duration: 0, distance: 0 };
    }
  }

  // Filtrer les destinations avec des coordonnées valides et trier par heure
  const validDestinations = dayPlan.destinations
    .filter(dest => dest.type !== 'hotel' && dest.lat && dest.lon)
    .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0));

  // Si pas de destinations valides, retourner un lien vers l'hôtel seulement
  if (validDestinations.length === 0) {
    return {
      url: `https://www.google.com/maps/search/?api=1&query=${hotelCoords.lat},${hotelCoords.lon}`,
      count: 0,
      duration: 0,
      distance: 0
    };
  }

  // Convertir le mode de transport au format Google Maps
  const gmapsMode = {
    'driving': 'driving',
    'walking': 'walking',
    'bicycle': 'bicycling'
  }[transportMode] || 'driving';

  // Calculer la durée et la distance totale estimées
  let totalDuration = 0;
  let totalDistance = 0;

  // Ajouter trajet hôtel -> première destination
  if (validDestinations[0].routeFromPrevious) {
    totalDuration += validDestinations[0].routeFromPrevious.duration;
    totalDistance += validDestinations[0].routeFromPrevious.distance;
  }

  // Ajouter trajets entre destinations
  for (let i = 0; i < validDestinations.length - 1; i++) {
    const current = validDestinations[i];
    const next = validDestinations[i + 1];

    // Si on a des infos de route entre les deux
    if (next.routeFromPrevious && next.previousLocation === current.name) {
      totalDuration += next.routeFromPrevious.duration;
      totalDistance += next.routeFromPrevious.distance;
    }
  }

  // Ajouter trajet dernière destination -> hôtel
  const lastDest = validDestinations[validDestinations.length - 1];
  if (lastDest.routeToHotel) {
    totalDuration += lastDest.routeToHotel.duration;
    totalDistance += lastDest.routeToHotel.distance;
  }

  // Construire l'URL Google Maps
  let url = `https://www.google.com/maps/dir/?api=1&origin=${hotelCoords.lat},${hotelCoords.lon}`;
  url += `&destination=${hotelCoords.lat},${hotelCoords.lon}`;

  if (validDestinations.length > 0) {
    url += `&waypoints=`;
    const waypoints = validDestinations.map(dest => `${dest.lat},${dest.lon}`).join('|');
    url += encodeURIComponent(waypoints);
    url += `&waypoints_opt=optimize:true`;
  }

  url += `&travelmode=${gmapsMode}`;

  return {
    url,
    count: validDestinations.length,
    duration: Math.round(totalDuration),
    distance: Math.round(totalDistance * 10) / 10
  };
};

// Fonction pour vérifier si deux dates sont consécutives
function isConsecutiveDate(date1, date2) {
  if (!date1 || !date2) return false;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Ajouter un jour à d1
  d1.setDate(d1.getDate() + 1);

  // Comparer les dates (ignorer l'heure)
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

// Fonction pour déterminer la vue initiale du calendrier selon la durée du voyage
const determineInitialView = (dailyPlanning) => {
  if (!dailyPlanning || dailyPlanning.length === 0) return 'dayGridMonth';

  // Trier les dates et trouver les dates de début et fin
  const sortedDates = dailyPlanning
    .map(day => day.date)
    .filter(date => date)
    .sort();

  if (sortedDates.length === 0) return 'dayGridMonth';

  const startDate = new Date(sortedDates[0]);
  const endDate = new Date(sortedDates[sortedDates.length - 1]);

  // Calculer la durée en jours
  const tripDuration = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  // Déterminer la vue en fonction de la durée
  if (tripDuration <= 2) {
    return 'timeGridDay';
  } else if (tripDuration < 15) {
    return 'timeGridWeek';
  } else {
    return 'dayGridMonth';
  }
};

export default function PlanningPage() {
  // États du composant
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [activites, setActivites] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [restaurants, setRestos] = useState([]);
  const [nbIntensity, setNbIntensity] = useState(1);
  const [quizResponse, setQuizResponse] = useState(null);
  const [allDestinationsWithCoords, setAllDestinationsWithCoords] = useState([]);
  const [transportMode, setTransportMode] = useState('walking');
  const [hotelNights, setHotelNights] = useState([]);
  const [totalNights, setTotalNights] = useState(0);
  const [hotelsWithDates, setHotelsWithDates] = useState([]);
  const [dailyPlanning, setDailyPlanning] = useState([]);
  const [planningGenerated, setPlanningGenerated] = useState(false);
  const [formId, setFormId] = useState(null);
  const [destination, setDestination] = useState(null);
  const [destinationId, setDestinationId] = useState(null);
  const [gastronomie, setGastronomie] = useState(null);
  const [userId, setUserId] = useState(null);

  // État pour MapBox
  const [selectedDay, setSelectedDay] = useState(null);
  const [mapboxViewport, setMapboxViewport] = useState({
    latitude: 48.8566, // Paris par défaut
    longitude: 2.3522,
    zoom: 12
  });

  const calendarRef = useRef(null);

  // Utiliser des refs pour suivre l'état de certaines opérations
  const dataLoaded = useRef(false);
  const coordsCompiled = useRef(false);
  const tripPlanned = useRef(false);

  // Fonction pour déterminer le mode de transport en fonction du budget
  const determineTransportMode = (transportBudget) => {
    if (transportBudget >= 8) return 'driving';
    if (transportBudget <= 3) return 'bicycle';
    return 'walking';
  };

  // Fonction pour préparer les données pour MapBox
  const prepareMapDataForDay = (day) => {
    if (!day || !day.destinations || day.destinations.length === 0) {
      return { features: [], center: [2.3522, 48.8566], bounds: null };
    }

    // Trouver les coordonnées de l'hôtel
    let hotelCoords = null;
    const hotelDest = day.destinations.find(dest => dest.type === 'hotel');

    if (hotelDest && hotelDest.lat && hotelDest.lon) {
      hotelCoords = [hotelDest.lon, hotelDest.lat]; // MapBox utilise [lon, lat]
    } else {
      // Chercher l'hôtel dans toutes les destinations
      const hotel = allDestinationsWithCoords.find(
        dest => dest.type === 'hotel' && dest.name === day.hotel
      );
      if (hotel && hotel.lat && hotel.lon) {
        hotelCoords = [hotel.lon, hotel.lat];
      }
    }

    // Créer les features GeoJSON pour chaque destination
    const features = [];

    // Ajouter l'hôtel
    if (hotelCoords) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: hotelCoords
        },
        properties: {
          id: 'hotel',
          name: day.hotel || 'Hôtel',
          type: 'hotel',
          icon: '🏨',
          iconColor: '#9C27B0'
        }
      });
    }

    // Ajouter les destinations
    day.destinations
      .filter(dest => dest.type !== 'hotel' && dest.lat && dest.lon)
      .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0))
      .forEach((dest, index) => {
        const iconMap = {
          'activite': { icon: '🎯', color: '#4CAF50' },
          'lieu': { icon: '🏛️', color: '#2196F3' },
          'restaurant': { icon: '🍽️', color: '#FF9800' }
        };

        const { icon, color } = iconMap[dest.type] || { icon: '📍', color: '#607D8B' };

        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [dest.lon, dest.lat]
          },
          properties: {
            id: `dest-${index}`,
            name: dest.name,
            type: dest.type,
            time: dest.heureDebutStr || '',
            icon,
            iconColor: color,
            order: index + 1
          }
        });
      });

    // Calculer les limites (bounds) pour ajuster la vue de la carte
    let bounds = null;
    if (features.length > 0) {
      const coordinates = features.map(f => f.geometry.coordinates);
      const lons = coordinates.map(c => c[0]);
      const lats = coordinates.map(c => c[1]);

      bounds = [
        [Math.min(...lons) - 0.01, Math.min(...lats) - 0.01], // SW
        [Math.max(...lons) + 0.01, Math.max(...lats) + 0.01]  // NE
      ];
    }

    // Déterminer le centre (pour les cas où les bounds ne fonctionnent pas)
    let center = hotelCoords || [2.3522, 48.8566]; // Paris par défaut

    return { features, center, bounds };
  };

  // Fonction pour compiler les destinations avec leurs coordonnées
  const compileDestinationsWithCoordinates = async () => {
    if (coordsCompiled.current || (!hotels.length && !activites.length && !lieux.length && !restaurants.length)) {
      return;
    }

    setLoading(true);

    try {
      const allDestinations = [
        ...hotels.map(hotel => ({
          ...hotel,
          type: 'hotel',
          lat: hotel.location?.coordinates?.lat,
          lon: hotel.location?.coordinates?.lon
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
        if (destination.type === 'hotel' && destination.lat && destination.lon) {
          destinationsWithCoords.push(destination);
          continue;
        }

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
            console.warn(`Erreur lors de la récupération des coordonnées pour ${destination.name}:`, error);
          }
        }
      }

      coordsCompiled.current = true;
      setAllDestinationsWithCoords(destinationsWithCoords);
    } catch (error) {
      console.error("Erreur lors de la compilation des coordonnées:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour planifier le voyage
  const planTrip = async () => {
    if (tripPlanned.current || hotels.length === 0 || allDestinationsWithCoords.length === 0 || totalNights === 0) {
      return;
    }

    try {
      setLoading(true);
      console.log("Début de la planification du voyage...");

      // Étape 1: Calculer la proximité des hôtels
      const proximityHotels = await calculateHotelProximity(hotels, allDestinationsWithCoords, transportMode);

      if (proximityHotels.length === 0) {
        console.warn("Aucun hôtel disponible après calcul de proximité");
        setLoading(false);
        return;
      }

      // Étape 2: Distribuer les nuits entre les hôtels
      const nights = distributeNights(proximityHotels, totalNights);
      setHotelNights(nights);

      // Étape 3: Assigner des dates aux hôtels
      if (nights.length > 0 && quizResponse?.departure_date) {
        const hotelDateRanges = assignHotelNights(nights, totalNights, quizResponse.departure_date);
        setHotelsWithDates(hotelDateRanges);

        // Étape 4: Mettre à jour les destinations avec les informations d'hôtel
        const destinationsWithHotelInfo = allDestinationsWithCoords.map(destination => {
          const hotel = hotelDateRanges.find(h => h.name === destination.nom_hotel);
          return {
            ...destination,
            hotelStartDate: hotel ? hotel.startDate : null,
            hotelEndDate: hotel ? hotel.endDate : null
          };
        });

        // Étape 5: Assigner les destinations aux différents jours
        const { destinationsWithDates, dailyPlanning: planning } = assignDaysToDestinations(
          destinationsWithHotelInfo,
          hotelDateRanges,
          nbIntensity
        );

        // Étape 6: Assigner des horaires aux destinations
        const planningWithSchedule = assignTimeToDestinations(planning, gastronomie);

        // Étape 7: Calculer les routes entre les destinations
        const planningWithRoutes = await calculateRoutesBetweenDestinations(
          planningWithSchedule,
          transportMode,
          destinationsWithHotelInfo
        );

        // Mise à jour des états
        setDailyPlanning(planningWithRoutes);

        // Mise à jour finale des destinations avec toutes les informations
        const finalDestinations = destinationsWithHotelInfo.map(dest => {
          if (dest.type === 'hotel') return dest;

          const destWithDate = destinationsWithDates.find(
            d => d.name === dest.name && d.type === dest.type
          );

          return {
            ...dest,
            visitDate: destWithDate?.visitDate || null
          };
        });

        setAllDestinationsWithCoords(finalDestinations);

        // Sélectionner le premier jour pour afficher sur la carte
        if (planningWithRoutes.length > 0) {
          setSelectedDay(planningWithRoutes[0]);

          // Préparer les données pour MapBox
          const { center, bounds } = prepareMapDataForDay(planningWithRoutes[0]);

          // Mettre à jour la vue de la carte
          setMapboxViewport(prev => ({
            ...prev,
            latitude: center[1],
            longitude: center[0],
            zoom: 12
          }));
        }
      }

      // Marquer comme planifié
      tripPlanned.current = true;
      setPlanningGenerated(true);

      // Log de fin qui indique clairement que tout est terminé
      console.log("=== PLANIFICATION TERMINÉE : Tous les calculs et traitements sont complets ===");

    } catch (error) {
      console.error("Erreur lors de la planification du voyage:", error);
      setError("Erreur lors de la planification du voyage");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer la dernière réponse de quiz
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

      // Calculer le nombre de nuits
      let calculatedNights = 0;
      if (quizData.departure_date && quizData.return_date) {
        const departureDate = new Date(quizData.departure_date);
        const returnDate = new Date(quizData.return_date);

        if (!isNaN(departureDate.getTime()) && !isNaN(returnDate.getTime())) {
          calculatedNights = Math.max(1, Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24)));
        }
      }

      // Calculer l'intensité
      let calculatedIntensity = 1;
      if (quizData.day_intensity_preference) {
        calculatedIntensity = Math.floor(quizData.day_intensity_preference / 2);
        calculatedIntensity = calculatedIntensity === 0 ? 1 : calculatedIntensity;
      }

      // Déterminer le mode de transport
      let calculatedMode = 'walking';
      if (quizData.budget_allocation && quizData.budget_allocation.transport) {
        calculatedMode = determineTransportMode(quizData.budget_allocation.transport);
      }

      setQuizResponse(quizData);
      setTotalNights(calculatedNights);
      setNbIntensity(calculatedIntensity);
      setTransportMode(calculatedMode);
    } catch (err) {
      console.error("Erreur lors de la récupération de la réponse de quiz:", err);
      setError("Erreur lors de la récupération de la réponse de quiz");
    }
  };

  // Fonction pour récupérer les destinations
  const fetchDestinations = async () => {
    try {
      const { data: formData, error: formError } = await supabase
        .from('saved_destinations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (formError) {
        console.error("❌ Erreur lors de la récupération des destinations:", formError);
        setError("Erreur lors de la récupération des destinations");
        return;
      }

      if (!formData || formData.length === 0) {
        console.warn("⚠️ Aucune destination trouvée");
        return;
      }

      const latestDestinations = formData[0];

      // Fonction pour vérifier et définir les données
      const safeSetArray = (data, setterFunction) => {
        if (data && Array.isArray(data)) {
          setterFunction(data);
        } else {
          setterFunction([]);
        }
      };

      safeSetArray(latestDestinations.hotels, setHotels);
      safeSetArray(latestDestinations.activites, setActivites);
      safeSetArray(latestDestinations.lieux, setLieux);
      safeSetArray(latestDestinations.restaurants, setRestos);
    } catch (err) {
      console.error("Erreur lors de la récupération des destinations:", err);
      setError("Erreur lors de la récupération des destinations");
    }
  };

  // Fonction pour sélectionner un jour à afficher sur la carte
  const selectDayForMap = (day) => {
    setSelectedDay(day);

    // Préparer les données pour MapBox
    const { center, bounds } = prepareMapDataForDay(day);

    // Mettre à jour la vue de la carte
    setMapboxViewport(prev => ({
      ...prev,
      latitude: center[1],
      longitude: center[0],
      zoom: 12 // Réinitialiser le zoom
    }));
  };

  // Effet unique pour l'initialisation
  useEffect(() => {
    if (dataLoaded.current) return;

    const initApp = async () => {
      setLoading(true);
      await fetchLatestQuizResponse();
      await fetchDestinations();
      dataLoaded.current = true;
      setLoading(false);
    };

    initApp();
  }, []);

  // Effet pour compiler les destinations
  useEffect(() => {
    if (!loading && dataLoaded.current && !coordsCompiled.current &&
      (hotels.length > 0 || activites.length > 0 || lieux.length > 0 || restaurants.length > 0)) {
      compileDestinationsWithCoordinates();
    }
  }, [loading]);

  // Effet pour gérer les données de l'utilisateur et les informations de destination
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        let userId;
        if (user && user.id) {
          userId = user.id;
        } else {
          userId = "65c55e51-915b-41b1-9bba-b6d241b193aa"; // Valeur par défaut
        }

        setUserId(userId);

        // Récupérer l'ID du formulaire et la destination
        const { data: formData, error: formError } = await supabase
          .from('quiz_responses')
          .select('id, destination, user_id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (formError || !formData || formData.length === 0) {
          console.warn("Aucune réponse trouvée dans quiz_responses");
          return;
        }

        const { id, destination: rawDestination, user_id } = formData[0];

        // Formatage de la destination
        const formattedDestination = rawDestination.charAt(0).toUpperCase() +
          rawDestination.slice(1).toLowerCase();

        // Récupérer l'ID de la destination
        const { data: destData, error: destError } = await supabase
          .from('destinations')
          .select('id')
          .eq('name', formattedDestination)
          .single();

        if (destError || !destData) {
          console.warn(`Aucune destination trouvée pour ${formattedDestination}`);
          return;
        }

        const destinationId = destData.id;

        // Récupérer les données de gastronomie
        const { data: descData, error: descError } = await supabase
          .from('destinations_description')
          .select('gastronomie')
          .eq('destination_id', destinationId)
          .single();

        if (descError || !descData) {
          console.warn("Aucune donnée de description trouvée");
          return;
        }

        // Traitement des horaires de repas
        const rawGastronomie = descData.gastronomie || {};
        let mealtimesArray = [];

        // Vérifier si horaires_repas existe et extraire les horaires
        if (rawGastronomie.horaires_repas) {
          if (typeof rawGastronomie.horaires_repas === 'string') {
            // Si c'est une chaîne, extraire les horaires avec des regex
            const timeRegex = /(\d{1,2}[h:]\d{0,2})\s*-\s*(\d{1,2}[h:]\d{0,2})/g;
            let match;
            while ((match = timeRegex.exec(rawGastronomie.horaires_repas)) !== null) {
              mealtimesArray.push({
                debut: match[1],
                fin: match[2]
              });
            }

            if (mealtimesArray.length === 0) {
              mealtimesArray = [rawGastronomie.horaires_repas];
            }
          } else if (typeof rawGastronomie.horaires_repas === 'object') {
            if (Array.isArray(rawGastronomie.horaires_repas)) {
              mealtimesArray = rawGastronomie.horaires_repas;
            } else {
              // Transformer l'objet en tableau d'horaires
              const repas = ['petit_dejeuner', 'dejeuner', 'diner', 'collation'];

              repas.forEach(type => {
                if (rawGastronomie.horaires_repas[type]) {
                  mealtimesArray.push({
                    type: type,
                    horaire: rawGastronomie.horaires_repas[type]
                  });
                }
              });

              if (mealtimesArray.length === 0) {
                Object.entries(rawGastronomie.horaires_repas).forEach(([key, value]) => {
                  mealtimesArray.push({
                    type: key,
                    horaire: value
                  });
                });
              }
            }
          }
        }

        // Mise à jour des états
        setFormId(id);
        setUserId(user_id);
        setDestination(formattedDestination);
        setDestinationId(destinationId);
        setGastronomie(mealtimesArray);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchFormData();
  }, []);

  // Effet pour planifier le voyage
  useEffect(() => {
    if (!loading &&
      coordsCompiled.current &&
      !tripPlanned.current &&
      allDestinationsWithCoords.length > 0 &&
      hotels.length > 0 &&
      totalNights > 0) {
      planTrip();
    }
  }, [loading, allDestinationsWithCoords.length]);

  // Effet pour gérer les redimensionnements
  useEffect(() => {
    const handleResize = () => {
      if (calendarRef.current && calendarRef.current.getApi) {
        document.querySelectorAll('.hotel-banner-span').forEach(el => el.remove());

        setTimeout(() => {
          // Code pour recréer les bannières d'hôtel
          const hotelStays = [];
          let currentStay = null;

          const dayCells = Array.from(document.querySelectorAll('[data-hotel]'))
            .sort((a, b) => a.getAttribute('data-date').localeCompare(b.getAttribute('data-date')));

          dayCells.forEach(cell => {
            const date = cell.getAttribute('data-date');
            const hotel = cell.getAttribute('data-hotel');

            if (!currentStay || currentStay.hotel !== hotel || !isConsecutiveDate(currentStay.endDate, date)) {
              if (currentStay) {
                hotelStays.push(currentStay);
              }
              currentStay = {
                hotel: hotel,
                startDate: date,
                endDate: date,
                startCell: cell,
                endCell: cell
              };
            } else {
              currentStay.endDate = date;
              currentStay.endCell = cell;
            }
          });

          if (currentStay) {
            hotelStays.push(currentStay);
          }
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="planning-container">
      <h1>Planning de Voyage {destination && `à ${destination}`}</h1>

      {loading && <div className="loading">Chargement de votre planning...</div>}

      {/* Informations du voyage */}
      {quizResponse && (
        <div className="trip-details">
          <h2>Détails du Voyage</h2>
          <p>Date de départ: {new Date(quizResponse.departure_date).toLocaleDateString()}</p>
          <p>Date de retour: {new Date(quizResponse.return_date).toLocaleDateString()}</p>
          <p>Nombre total de nuits: {totalNights}</p>
          <p>Intensité des journées: {nbIntensity} activité(s) par jour</p>
          {quizResponse.budget_allocation && (
            <div className="budget-info">
              <h3>Budget alloué</h3>
              <div className="budget-bars">
                <div className="budget-bar">
                  <span className="budget-label">Transport</span>
                  <div className="budget-bar-container">
                    <div className="budget-bar-fill" style={{ width: `${quizResponse.budget_allocation.transport * 10}%` }}></div>
                  </div>
                  <span className="budget-value">{quizResponse.budget_allocation.transport}/10</span>
                </div>
                <div className="budget-bar">
                  <span className="budget-label">Hébergement</span>
                  <div className="budget-bar-container">
                    <div className="budget-bar-fill" style={{ width: `${quizResponse.budget_allocation.hebergement * 10}%` }}></div>
                  </div>
                  <span className="budget-value">{quizResponse.budget_allocation.hebergement}/10</span>
                </div>
                <div className="budget-bar">
                  <span className="budget-label">Activités</span>
                  <div className="budget-bar-container">
                    <div className="budget-bar-fill" style={{ width: `${quizResponse.budget_allocation.activites * 10}%` }}></div>
                  </div>
                  <span className="budget-value">{quizResponse.budget_allocation.activites}/10</span>
                </div>
                <div className="budget-bar">
                  <span className="budget-label">Restauration</span>
                  <div className="budget-bar-container">
                    <div className="budget-bar-fill" style={{ width: `${quizResponse.budget_allocation.restaurant * 10}%` }}></div>
                  </div>
                  <span className="budget-value">{quizResponse.budget_allocation.restaurant}/10</span>
                </div>
              </div>
            </div>
          )}
          <div className="transport-mode">
            <p>Mode de transport:
              <span className={`transport-icon ${transportMode}`}>
                {transportMode === 'driving' ? '🚗' :
                  transportMode === 'bicycle' ? '🚲' : '🚶‍♂️'}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Vue en deux colonnes: Planning et Carte */}
      {dailyPlanning.length > 0 && (
        <div className="planning-map-container">
          {/* Colonne de gauche: Planning */}
          <div className="daily-planning-column">
            <h2>Planning Journalier</h2>
            {dailyPlanning
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((day, index) => {
                // Calculer l'itinéraire optimisé pour ce jour
                const itinerary = generateOptimizedItinerary(day, transportMode, allDestinationsWithCoords);

                return (
                  <div
                    key={index}
                    className={`daily-plan ${selectedDay?.date === day.date ? 'selected-day' : ''}`}
                    onClick={() => selectDayForMap(day)}
                  >
                    <h3>
                      Jour {index + 1} - {new Date(day.date).toLocaleDateString()}
                      <span className="hotel-badge">🏨 {day.hotel}</span>
                    </h3>

                    {/* Bouton Google Maps */}
                    {itinerary.count > 0 && (
                      <a
                        href={itinerary.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="maps-button"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="btn-icon">🔗</span>
                        <span className="btn-text">
                          Google Maps
                          {itinerary.distance > 0 && (
                            <span className="btn-details">
                              {" - "}{itinerary.distance} km
                              {itinerary.duration > 0 && (
                                itinerary.duration >= 60
                                  ? ` (${Math.floor(itinerary.duration / 60)}h${itinerary.duration % 60 > 0 ? itinerary.duration % 60 + 'min' : ''})`
                                  : ` (${itinerary.duration} min)`
                              )}
                            </span>
                          )}
                        </span>
                      </a>
                    )}

                    {/* Liste des destinations */}
                    {day.destinations && day.destinations.length > 0 ? (
                      <ul className="day-activities">
                        {day.destinations
                          .filter(dest => dest.type !== 'hotel')
                          .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0))
                          .map((dest, destIndex) => (
                            <li key={destIndex} className={`activity-type-${dest.type}`}>
                              {dest.heureDebutStr && dest.heureFinStr
                                ? `(${dest.heureDebutStr} - ${dest.heureFinStr}) `
                                : ''}

                              {dest.type === 'activite' ? '🎯 ' :
                                dest.type === 'lieu' ? '🏛️ ' :
                                  dest.type === 'restaurant' ? '🍽️ ' : '📍 '}

                              {dest.name}

                              {/* Afficher les trajets si disponibles */}
                              {dest.routeFromPrevious && (
                                <div className="route-info">
                                  <small>
                                    {dest.previousLocation === "Hôtel" ? '🏨 ' : '📍 '}
                                    {dest.previousLocation} → {dest.name}
                                    {' ('}{dest.routeFromPrevious.distance.toFixed(1)} km,
                                    {dest.routeFromPrevious.duration >= 60
                                      ? ` ${Math.floor(dest.routeFromPrevious.duration / 60)}h${dest.routeFromPrevious.duration % 60 > 0 ? dest.routeFromPrevious.duration % 60 + 'min' : ''}`
                                      : ` ${dest.routeFromPrevious.duration} min`})
                                  </small>
                                </div>
                              )}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p>Aucune destination planifiée pour ce jour.</p>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Colonne de droite: Carte MapBox */}
          <div className="map-column">
            <h2>Carte des Destinations</h2>
            <MapView
              selectedDay={selectedDay}
              viewport={mapboxViewport}
              transportMode={transportMode}
              allDestinationsWithCoords={allDestinationsWithCoords}
            />
          </div>
        </div>
      )}

      {/* Vue Calendrier */}
      {dailyPlanning.length > 0 && (
        <div className="calendar-view">
          <h2>Vue Calendrier</h2>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={determineInitialView(dailyPlanning)}
            initialDate={dailyPlanning.length > 0 ? dailyPlanning[0].date : new Date().toISOString().split('T')[0]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            slotMinTime="06:00:00"
            slotMaxTime="23:00:00"
            allDaySlot={false}
            events={[
              // Événements des destinations
              ...dailyPlanning.flatMap(day =>
                day.destinations.map(dest => {
                  // Trouver la destination complète avec photos dans allDestinationsWithCoords
                  const fullDest = allDestinationsWithCoords.find(d =>
                    d.name === dest.name && d.type === dest.type
                  );

                  // Récupérer l'URL de la photo si disponible
                  const photoUrl = fullDest && fullDest.photos && fullDest.photos[0]
                    ? fullDest.photos[0]
                    : null;

                  // Sélectionner l'icône et la couleur de secours en fonction du type
                  let icon, bgColor, borderColor;

                  switch (dest.type) {
                    case 'activite':
                      icon = '🎯';
                      bgColor = '#4CAF50';
                      borderColor = '#388E3C';
                      break;
                    case 'lieu':
                      icon = '🏛️';
                      bgColor = '#2196F3';
                      borderColor = '#1976D2';
                      break;
                    case 'restaurant':
                      icon = '🍽️';
                      bgColor = '#FF9800';
                      borderColor = '#F57C00';
                      break;
                    case 'hotel':
                      icon = '🏨';
                      bgColor = '#9C27B0';
                      borderColor = '#7B1FA2';
                      break;
                    default:
                      icon = '📍';
                      bgColor = '#607D8B';
                      borderColor = '#455A64';
                  }

                  // Créer les événements en utilisant les photos comme fond
                  if (dest.heureDebutStr && dest.heureFinStr) {
                    return {
                      title: `${icon} ${dest.name}`,
                      start: `${day.date}T${dest.heureDebutStr}`,
                      end: `${day.date}T${dest.heureFinStr}`,
                      backgroundColor: photoUrl ? 'transparent' : bgColor,
                      borderColor: borderColor,
                      textColor: '#FFFFFF',
                      allDay: false,
                      extendedProps: {
                        type: dest.type,
                        destination: dest,
                        icon: icon,
                        photoUrl: photoUrl,
                        useAsBackground: true
                      }
                    };
                  } else {
                    return {
                      title: `${icon} ${dest.name}`,
                      start: day.date,
                      allDay: true,
                      date: day.date,
                      backgroundColor: photoUrl ? 'transparent' : bgColor,
                      borderColor: borderColor,
                      textColor: '#FFFFFF',
                      extendedProps: {
                        type: dest.type,
                        destination: dest,
                        icon: icon,
                        photoUrl: photoUrl,
                        useAsBackground: true
                      }
                    };
                  }
                })
              ),
              // Événements des repas
              ...generateMealEvents(dailyPlanning, gastronomie)
            ]}
            eventContent={(eventInfo) => {
              const { extendedProps } = eventInfo.event;

              // Pour les événements de repas
              if (extendedProps && extendedProps.type === 'repas') {
                return (
                  <div style={{ padding: '4px' }}>
                    <span style={{ fontSize: '1.2em' }}>{eventInfo.event.title}</span>
                  </div>
                );
              }

              // Pour les destinations avec photos en arrière-plan
              if (extendedProps && extendedProps.photoUrl && extendedProps.useAsBackground) {
                const containerStyle = {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  height: '100%',
                  width: '100%',
                  padding: '5px',
                  backgroundImage: `url(${extendedProps.photoUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '5px'
                };

                const overlayStyle = {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1
                };

                const textStyle = {
                  position: 'relative',
                  zIndex: 2,
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px black',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  width: '100%'
                };

                return (
                  <div style={containerStyle}>
                    <div style={overlayStyle}></div>
                    <div style={textStyle}>
                      <span style={{
                        fontSize: '1.5em',
                        marginRight: '5px'
                      }}>
                        {extendedProps.icon}
                      </span>
                      <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {extendedProps.destination.name}
                      </span>
                    </div>
                  </div>
                );
              }

              // Pour les destinations sans photos
              if (extendedProps && extendedProps.icon) {
                return (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    height: '100%'
                  }}>
                    <span style={{
                      fontSize: '1.5em',
                      marginRight: '5px'
                    }}>
                      {extendedProps.icon}
                    </span>
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {extendedProps.destination.name}
                    </span>
                  </div>
                );
              }

              return null;
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            height="auto"
            contentHeight={800}
            dayCellDidMount={(info) => {
              // Obtenir la date au format YYYY-MM-DD
              const year = info.date.getFullYear();
              const month = String(info.date.getMonth() + 1).padStart(2, '0');
              const day = String(info.date.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              // Trouver le planning pour cette date exacte
              const dayPlan = dailyPlanning.find(day => day.date === dateStr);

              if (dayPlan && dayPlan.hotel) {
                // Ajouter un attribut data pour identifier facilement cette cellule
                info.el.setAttribute('data-date', dateStr);
                info.el.setAttribute('data-hotel', dayPlan.hotel);
              }
            }}
            datesSet={(dateInfo) => {
              setTimeout(() => {
                // Nettoyer les éventuelles bannières existantes
                document.querySelectorAll('.hotel-banner-span').forEach(el => el.remove());

                // Regrouper les cellules par hôtel et date consécutive
                const hotelGroups = {};
                const dayCells = Array.from(document.querySelectorAll('[data-hotel]'))
                  .sort((a, b) => a.getAttribute('data-date').localeCompare(b.getAttribute('data-date')));

                // Première passe: regrouper par hôtel
                dayCells.forEach(cell => {
                  const date = cell.getAttribute('data-date');
                  const hotel = cell.getAttribute('data-hotel');

                  if (!hotelGroups[hotel]) {
                    hotelGroups[hotel] = [];
                  }

                  hotelGroups[hotel].push({
                    date,
                    cell
                  });
                });

                // Seconde passe: trouver les séquences consécutives pour chaque hôtel
                Object.keys(hotelGroups).forEach(hotel => {
                  const cellsForHotel = hotelGroups[hotel].sort((a, b) => a.date.localeCompare(b.date));
                  let currentSequence = [];

                  for (let i = 0; i < cellsForHotel.length; i++) {
                    const currentCell = cellsForHotel[i];

                    // Si c'est le premier élément ou si les jours sont consécutifs
                    if (i === 0 ||
                      isConsecutiveDate(cellsForHotel[i - 1].date, currentCell.date) &&
                      currentCell.cell.parentElement === cellsForHotel[i - 1].cell.parentElement) {
                      currentSequence.push(currentCell);
                    } else {
                      // Fin d'une séquence, créer une bannière
                      if (currentSequence.length > 0) {
                        createHotelBanner(currentSequence, hotel);
                      }
                      currentSequence = [currentCell];
                    }
                  }

                  // Traiter la dernière séquence
                  if (currentSequence.length > 0) {
                    createHotelBanner(currentSequence, hotel);
                  }
                });

                // Fonction pour créer une bannière pour une séquence
                function createHotelBanner(sequence, hotelName) {
                  if (sequence.length === 0) return;

                  const firstCell = sequence[0].cell;
                  const banner = document.createElement('div');
                  banner.className = 'hotel-banner';
                  banner.innerHTML = `🏨 ${hotelName}`;

                  // Si plusieurs jours consécutifs, étendre la bannière
                  if (sequence.length > 1) {
                    banner.classList.add('hotel-banner-span');
                    const firstCellWidth = firstCell.offsetWidth;
                    banner.style.width = `${firstCellWidth * sequence.length - 10}px`;
                  }

                  // Ajouter la bannière à la première cellule
                  const dayTop = firstCell.querySelector('.fc-daygrid-day-top');
                  if (dayTop) {
                    dayTop.after(banner);
                  } else {
                    firstCell.insertBefore(banner, firstCell.firstChild);
                  }
                }
              }, 300);
            }}
            dateClick={(info) => {
              // Trouver le jour correspondant à la date cliquée
              const clickedDay = dailyPlanning.find(day => day.date === info.dateStr);
              if (clickedDay) {
                selectDayForMap(clickedDay);
              }
            }}
            eventClick={(info) => {
              // Si l'événement n'est pas un repas et appartient à un jour spécifique
              if (info.event.extendedProps && info.event.extendedProps.type !== 'repas') {
                const clickedDay = dailyPlanning.find(day =>
                  day.date === info.event.start.toISOString().split('T')[0]
                );
                if (clickedDay) {
                  selectDayForMap(clickedDay);
                }
              }
            }}
          />
        </div>
      )}

      <style jsx>{`
        .planning-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        h1, h2, h3 {
          color: #333;
        }
        
        h1 {
          margin-bottom: 20px;
          font-size: 28px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
        }
        
        h2 {
          font-size: 22px;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        
        h3 {
          font-size: 18px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-style: italic;
          color: #666;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .error-message {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          border-left: 4px solid #d32f2f;
        }
        
        .trip-details {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .trip-details p {
          margin: 8px 0;
          line-height: 1.5;
        }
        
        .budget-info {
          margin-top: 15px;
        }
        
        .budget-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }
        
        .budget-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .budget-label {
          min-width: 110px;
          font-weight: 500;
        }
        
        .budget-bar-container {
          flex-grow: 1;
          height: 10px;
          background-color: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .budget-bar-fill {
          height: 100%;
          background-color: #2196F3;
          border-radius: 5px;
        }
        
        .budget-value {
          min-width: 40px;
          text-align: right;
          font-weight: 500;
        }
        
        .transport-mode {
          margin-top: 15px;
          display: flex;
          align-items: center;
        }
        
        .transport-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-left: 10px;
          font-size: 18px;
        }
        
        .transport-icon.driving {
          background-color: #FF9800;
        }
        
        .transport-icon.bicycle {
          background-color: #4CAF50;
        }
        
        .transport-icon.walking {
          background-color: #2196F3;
        }
        
        .planning-map-container {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        @media (max-width: 768px) {
          .planning-map-container {
            flex-direction: column;
          }
        }
        
        .daily-planning-column {
          flex: 1;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 10px;
        }
        
        .map-column {
          flex: 1;
          height: 600px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .daily-plan {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .daily-plan:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .selected-day {
          border-left: 4px solid #4285F4;
          background-color: #f0f7ff;
        }
        
        .hotel-badge {
          margin-left: 10px;
          font-size: 0.8em;
          background-color: #9C27B0;
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
        }
        
        .day-activities {
          list-style: none;
          padding-left: 0;
          margin-top: 10px;
        }
        
        .day-activities li {
          padding: 8px 10px;
          margin-bottom: 5px;
          border-radius: 4px;
          background-color: #f9f9f9;
        }
        
        .activity-type-activite {
          border-left: 3px solid #4CAF50;
        }
        
        .activity-type-lieu {
          border-left: 3px solid #2196F3;
        }
        
        .activity-type-restaurant {
          border-left: 3px solid #FF9800;
        }
        
        .route-info {
          margin-top: 5px;
          padding-left: 20px;
          color: #666;
        }
        
        .maps-button {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 4px;
          font-weight: bold;
          text-decoration: none;
          transition: background-color 0.2s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          background-color: #1a73e8;
          color: white;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        
        .maps-button:hover {
          background-color: #0d62d0;
        }
        
        .btn-icon {
          font-size: 1.4em;
          margin-right: 8px;
        }
        
        .btn-text {
          font-size: 0.9em;
        }
        
        .btn-details {
          font-weight: normal;
          opacity: 0.9;
        }
        
        .calendar-view {
          margin-top: 30px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        :global(.hotel-banner) {
          background-color: #9C27B0 !important;
          color: white !important;
          border-left: 3px solid #7B1FA2 !important;
          padding: 2px 5px;
          margin: 2px 0;
          font-size: 0.8em;
          font-weight: bold;
          text-align: left;
          border-radius: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          z-index: 5;
        }
        
        :global(.hotel-banner-span) {
          border-right: 3px solid #7B1FA2 !important;
          position: relative;
          margin-right: -10px;
        }
        
        :global(.fc .fc-view-harness) {
          overflow: visible !important;
        }
        
        :global(.fc-dayGridMonth-view) {
          overflow: visible !important;
        }
        
        :global(.fc-view) {
          overflow: visible !important;
        }
        
        :global(.fc-scroller) {
          overflow: visible !important;
        }
        
        :global(.fc-event) {
          border-radius: 6px;
          margin: 2px 0;
          overflow: hidden;
        }
        
        :global(.fc-daygrid-event) {
          min-height: 60px;
          padding: 0;
        }
        
        :global(.fc-timegrid-event .fc-event-main) {
          padding: 0;
          height: 100%;
        }
        
        :global(.fc-daygrid-day-events) {
          min-height: 60px;
        }
        
        :global(.fc-event-time) {
          font-weight: bold;
        }
        
        :global(.fc-timeGridWeek-view .hotel-banner),
        :global(.fc-timeGridDay-view .hotel-banner) {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          margin-top: 0;
        }
      `}</style>
    </div>
  );
}