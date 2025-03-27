import { useEffect, useState, useRef } from 'react';
import supabase from '../supabaseClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/Planning.css';
import 'leaflet/dist/leaflet.css';
import StaticMapPreview from '../components/StaticMapPreview';
import LeafletMapPreview from '../components/LeafletMapPreview';
import MapPreviewModal from '../components/MapPreviewModal'; // Ajouter l'import du nouveau composant

// Fonctions utilitaires déplacées hors du composant

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

function estPremierJourHotel(date, hotel, dailyPlanning) {
  // Validation des paramètres
  if (!date || !hotel || !dailyPlanning || !Array.isArray(dailyPlanning) || dailyPlanning.length === 0) {
    console.warn("Paramètres invalides pour estPremierJourHotel");
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

const assignTimeToDestinations = (dailyPlanning, gastronomieHoraires) => {
  if (!dailyPlanning || !dailyPlanning.length || !gastronomieHoraires || !gastronomieHoraires.length) {
    console.warn("Données insuffisantes pour assigner des horaires");
    return dailyPlanning;
  }

  // Extraire les horaires de repas
  let petitDejeuner = { debut: "7:00", fin: "9:00" };  // Valeurs par défaut
  let dejeuner = { debut: "12:00", fin: "14:00" };
  let diner = { debut: "19:00", fin: "21:00" };

  // Rechercher les horaires corrects dans gastronomieHoraires
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

    // Si c'est le premier jour, ajouter une note dans le planning
    if (estPremierJour) {
      console.log(`Jour ${day.date} - Premier jour à l'hôtel ${day.hotel} - Décalage de 30 minutes appliqué`);
    }

    // Définir les plages horaires de la journée
    const debutJournee = convertirEnMinutes(petitDejeuner.fin) - (estPremierJour ? decalage : 0);  // Commence après le petit-déjeuner + décalage si premier jour
    const finJournee = convertirEnMinutes(diner.debut) - (estPremierJour ? decalage : 0);          // Termine avant le dîner
    const millieuJournee = convertirEnMinutes(dejeuner.debut) - (estPremierJour ? decalage : 0); // Décaler aussi l'heure du déjeuner

    if (estPremierJour) {
      console.log("Jour oui, ", debutJournee);
    }
    else {
      console.log("Jour non, ", debutJournee);
    }


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

      //Appliquer le décalage si c'est le premier jour d'hôtel
      // if (estPremierJour) {
      //   debut -= decalage;
      //   fin -= decalage;
      // }

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
      const debutAprem = convertirEnMinutes(dejeuner.fin) - (estPremierJour ? decalage : 0);  // Commencer après le déjeuner
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
// Fonctions utilitaires

// Extraire les heures d'une chaîne de caractères
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

// Standardiser les horaires au format 24h
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

// Convertir une heure au format "hh:mm" en minutes depuis minuit
function convertirEnMinutes(heure) {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

// Convertir des minutes en format heure "hh:mm"
function convertirEnHeure(minutes) {
  const heures = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${heures < 10 ? '0' + heures : heures}:${mins < 10 ? '0' + mins : mins}`;
}

const calculateRoutesBetweenDestinations = async (dailyPlanning, transportMode, allDestinationsWithCoords) => {
  if (!dailyPlanning || !dailyPlanning.length) {
    console.warn("Données insuffisantes pour calculer les trajets");
    return dailyPlanning;
  }

  // Clone du planning pour modification
  const planningWithRoutes = JSON.parse(JSON.stringify(dailyPlanning));

  // Pour chaque jour du planning
  for (const day of planningWithRoutes) {
    // Retirer la condition qui ignore les jours avec une seule destination
    // if (!day.destinations || day.destinations.length < 2) continue;

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

          // Ajuster l'heure de début de la destination suivante en fonction du temps de trajet et de fin de l'activité actuelle
          // Vérifier s'il y a un écart suffisant entre la fin de l'activité actuelle et le début de la suivante
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
      // Ce trajet doit être calculé même s'il n'y a qu'une seule destination dans la journée
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

// Version améliorée de la fonction generateMealEvents

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

  // Créer les événements de repas pour chaque jour
  const mealEvents = [];

  // Récupérer toutes les dates uniques et les trier
  const dates = dailyPlanning
    .map(day => day.date)
    .filter(date => date) // Éliminer les valeurs null ou undefined
    .sort((a, b) => new Date(a) - new Date(b));

  if (dates.length === 0) return [];

  // Fonction pour ajuster l'heure en fonction du décalage
  const ajusterHeure = (heure, minutesAjoutees) => {
    const [heures, minutes] = heure.split(':').map(Number);
    const totalMinutes = heures * 60 + minutes - minutesAjoutees;
    const nouvellesHeures = Math.floor(totalMinutes / 60);
    const nouveauxMinutes = totalMinutes % 60;
    return `${String(nouvellesHeures).padStart(2, '0')}:${String(nouveauxMinutes).padStart(2, '0')}`;
  };

  // Pour chaque jour de voyage
  for (const date of dates) {
    try {
      // Vérifier si la date est valide
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
          // Si le restaurant n'a pas d'horaire, il ne peut pas chevaucher
          if (!resto.heureDebutStr || !resto.heureFinStr) return false;

          // Convertir les horaires en minutes
          const restoStart = convertirEnMinutes(resto.heureDebutStr);
          const restoEnd = convertirEnMinutes(resto.heureFinStr);
          const mealStartMin = convertirEnMinutes(mealStart);
          const mealEndMin = convertirEnMinutes(mealEnd);

          // Vérifier s'il y a chevauchement
          return !(restoEnd <= mealStartMin || restoStart >= mealEndMin);
        });
      };

      // Petit déjeuner (seulement s'il n'y a pas de restaurant programmé à cette heure)
      // Le petit déjeuner n'est pas décalé car il a lieu à l'hôtel
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

      // Déjeuner (seulement s'il n'y a pas de restaurant programmé à cette heure)
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
            repasType: 'dejeuner',
            estPremierJour: estPremierJour // Pour débogage
          },
          allDay: false
        });
      }

      // Dîner (seulement s'il n'y a pas de restaurant programmé à cette heure)
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
            repasType: 'diner',
            estPremierJour: estPremierJour // Pour débogage
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


const exportDayItineraryToCSV = (dayPlanning, date) => {
  if (!dayPlanning || !dayPlanning.destinations || dayPlanning.destinations.length === 0) {
    console.warn("Aucune donnée à exporter pour cette journée");
    return;
  }

  // Trier les destinations par heure
  const destinations = [...dayPlanning.destinations]
    .filter(dest => dest.type !== 'hotel')
    .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0));

  // Créer les en-têtes du CSV
  let csvContent = "Heure de début,Heure de fin,Nom,Type,Distance,Durée trajet,Point de départ\n";

  // Ajouter chaque destination
  for (const dest of destinations) {
    const heureDebut = dest.heureDebutStr || "";
    const heureFin = dest.heureFinStr || "";
    const nom = dest.name.replace(/,/g, " "); // Éviter les problèmes avec les virgules
    const type = dest.type || "";

    let distance = "";
    let duree = "";
    let depart = "";

    if (dest.routeFromPrevious) {
      distance = dest.routeFromPrevious.distance.toFixed(1);
      duree = dest.routeFromPrevious.duration;
      depart = dest.previousLocation || "";
    }

    // Créer la ligne CSV
    const row = `"${heureDebut}","${heureFin}","${nom}","${type}","${distance}","${duree}","${depart}"\n`;
    csvContent += row;
  }

  // Créer un blob et déclencher le téléchargement
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `itineraire-${date}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Génère un lien Google Maps pour un trajet spécifique
 */
const generateGoogleMapsLink = (depart, arrivee, transportMode) => {
  // Vérification de sécurité pour les coordonnées
  if (!depart || !depart.lat || !depart.lon || !arrivee || !arrivee.lat || !arrivee.lon) {
    console.warn("Coordonnées manquantes pour générer le lien Google Maps");
    return "#";
  }

  // Convertir le mode de transport au format Google Maps
  const gmapsMode = {
    'driving': 'driving',
    'walking': 'walking',
    'bicycle': 'bicycling'
  }[transportMode] || 'driving';

  // Créer l'URL Google Maps
  return `https://www.google.com/maps/dir/?api=1&origin=${depart.lat},${depart.lon}&destination=${arrivee.lat},${arrivee.lon}&travelmode=${gmapsMode}`;
};

const generateDayItinerary = (dayPlan, transportMode, allDestinations) => {
  if (!dayPlan || !dayPlan.destinations || dayPlan.destinations.length === 0) {
    console.warn("Aucune destination pour cette journée");
    return "#";
  }

  // Récupérer les coordonnées de l'hôtel
  let hotelCoords = null;
  // Chercher l'hôtel dans les destinations de la journée
  const hotelDest = dayPlan.destinations.find(dest => dest.type === 'hotel');
  if (hotelDest && hotelDest.lat && hotelDest.lon) {
    hotelCoords = { lat: hotelDest.lat, lon: hotelDest.lon };
  } else {
    // Chercher l'hôtel dans toutes les destinations
    const hotel = allDestinations.find(
      dest => dest.type === 'hotel' && dest.name === dayPlan.hotel
    );
    if (hotel && hotel.lat && hotel.lon) {
      hotelCoords = { lat: hotel.lat, lon: hotel.lon };
    }
  }

  // Si on n'a pas trouvé les coordonnées de l'hôtel, on ne peut pas générer l'itinéraire
  if (!hotelCoords) {
    console.warn(`Coordonnées introuvables pour l'hôtel: ${dayPlan.hotel}`);
    return "#";
  }

  // Trier les destinations par heure de début
  const sortedDestinations = [...dayPlan.destinations]
    .filter(dest => dest.type !== 'hotel' && dest.lat && dest.lon)
    .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0));

  // Si pas de destinations, retourner un lien vers l'hôtel seulement
  if (sortedDestinations.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${hotelCoords.lat},${hotelCoords.lon}`;
  }

  // Convertir le mode de transport au format Google Maps
  const gmapsMode = {
    'driving': 'driving',
    'walking': 'walking',
    'bicycle': 'bicycling'
  }[transportMode] || 'driving';

  // Construire l'URL Google Maps
  // Format: https://www.google.com/maps/dir/?api=1&origin=LAT,LON&destination=LAT,LON&waypoints=LAT,LON|LAT,LON&travelmode=MODE

  // Point de départ (hôtel)
  let url = `https://www.google.com/maps/dir/?api=1&origin=${hotelCoords.lat},${hotelCoords.lon}`;

  // Destination finale (retour à l'hôtel)
  url += `&destination=${hotelCoords.lat},${hotelCoords.lon}`;

  // Waypoints (étapes intermédiaires)
  if (sortedDestinations.length > 0) {
    url += `&waypoints=`;

    const waypoints = sortedDestinations.map(dest =>
      `${dest.lat},${dest.lon}`
    ).join('|');

    url += encodeURIComponent(waypoints);
  }

  // Mode de transport
  url += `&travelmode=${gmapsMode}`;

  return url;
};

/**
 * Génère un lien Google Maps pour un itinéraire optimisé d'une journée
 * @param {Object} dayPlan - Le planning d'une journée
 * @param {string} transportMode - Le mode de transport utilisé
 * @param {Array} allDestinations - Toutes les destinations avec coordonnées
 * @return {Object} Infos et URL pour l'itinéraire
 */

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

  const [previewDay, setPreviewDay] = useState(null);
  const [mapDay, setMapDay] = useState(null);

  const [showMapModal, setShowMapModal] = useState(false);
const [selectedDayMarkers, setSelectedDayMarkers] = useState([]);
const [selectedDayHotel, setSelectedDayHotel] = useState(null);

  const placeholderImage = '/api/placeholder/400/320';

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };


  // Utiliser des refs pour suivre l'état de certaines opérations
  const dataLoaded = useRef(false);
  const coordsCompiled = useRef(false);
  const tripPlanned = useRef(false);

  const calendarRef = useRef(null);

  // Fonction pour déterminer le mode de transport en fonction du budget
  const determineTransportMode = (transportBudget) => {
    if (transportBudget >= 8) return 'driving';
    if (transportBudget <= 3) return 'bicycle';
    return 'walking';
  };

  // Fonction pour compiler les destinations avec leurs coordonnées
  const compileDestinationsWithCoordinates = async () => {
    // Vérifier si nous avons déjà compilé ou si nous n'avons pas de données
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
            console.warn(`Erreur lors de la récupération des coordonnées pour ${destination.name}:`, error);
          }
        }
      }

      // Marquer comme compilé avant de mettre à jour l'état
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
    // Vérifier si nous avons déjà planifié ou si nous n'avons pas de données
    if (tripPlanned.current || hotels.length === 0 || allDestinationsWithCoords.length === 0 || totalNights === 0) {
      return;
    }

    try {
      setLoading(true);

      // Étape 1: Calculer la proximité des hôtels
      const proximityHotels = await calculateHotelProximity(hotels, allDestinationsWithCoords, transportMode);

      if (proximityHotels.length === 0) {
        console.warn("Aucun hôtel disponible après calcul de proximité");
        setLoading(false);
        return;
      }

      // Étape 2: Distribuer les nuits entre les hôtels
      const nights = distributeNights(proximityHotels, totalNights);

      // Étape 3: Assigner des dates aux hôtels
      if (nights.length > 0 && quizResponse?.departure_date) {
        const hotelDateRanges = assignHotelNights(nights, totalNights, quizResponse.departure_date);

        // Étape 4: Mettre à jour les destinations avec les informations d'hôtel
        const destinationsWithHotelInfo = allDestinationsWithCoords.map(destination => {
          // Trouver l'hôtel correspondant
          const hotel = hotelDateRanges.find(h => h.name === destination.nom_hotel);

          return {
            ...destination,
            hotelStartDate: hotel ? hotel.startDate : null,
            hotelEndDate: hotel ? hotel.endDate : null
          };
        });

        // Étape 5: Assigner les jours de visite aux destinations
        const { destinationsWithDates, dailyPlanning: planning } = assignDaysToDestinations(
          destinationsWithHotelInfo,
          hotelDateRanges,
          nbIntensity
        );

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

        // Mettre à jour les états une seule fois
        setHotelsWithDates(hotelDateRanges);
        setDailyPlanning(planning);
        console.log("Planning 1 : ", dailyPlanning);
        const planningWithSchedule = assignTimeToDestinations(planning, gastronomie);
        const planningWithRoutes = await calculateRoutesBetweenDestinations(planningWithSchedule, transportMode, finalDestinations);
        setDailyPlanning(planningWithRoutes);
        console.log("Planning 1 : ", dailyPlanning);
        setAllDestinationsWithCoords(finalDestinations);
        setHotelNights(nights);
      } else {
        setHotelNights(nights);
      }

      // Marquer comme planifié
      tripPlanned.current = true;
      setPlanningGenerated(true);
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

      // Mettre à jour tous les états en une seule fois
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

      // Mettre à jour tous les types de destinations en une seule fois
      safeSetArray(latestDestinations.hotels, setHotels);
      safeSetArray(latestDestinations.activites, setActivites);
      safeSetArray(latestDestinations.lieux, setLieux);
      safeSetArray(latestDestinations.restaurants, setRestos);
    } catch (err) {
      console.error("Erreur lors de la récupération des destinations:", err);
      setError("Erreur lors de la récupération des destinations");
    }
  };

  const prepareMapDataForDay = (day) => {
    // Vérification de sécurité pour éviter les erreurs si day est undefined
    if (!day || !day.destinations || day.destinations.length === 0) {
      console.warn("Aucune donnée à afficher pour cette journée");
      return { markers: [], hotelCoords: null };
    }
  
    // Trouver les coordonnées de l'hôtel
    let hotelCoords = null;
    const hotelDest = day.destinations.find(dest => dest.type === 'hotel');
    
    if (hotelDest && hotelDest.lat && hotelDest.lon) {
      hotelCoords = { lat: hotelDest.lat, lon: hotelDest.lon };
    } else {
      // Chercher l'hôtel dans toutes les destinations
      const hotel = allDestinationsWithCoords.find(
        dest => dest.type === 'hotel' && dest.name === day.hotel
      );
      if (hotel && hotel.lat && hotel.lon) {
        hotelCoords = { lat: hotel.lat, lon: hotel.lon };
      }
    }
  
    // Préparer les marqueurs pour chaque destination
    const markers = day.destinations
      .filter(dest => dest.type !== 'hotel' && dest.lat && dest.lon)
      .map(dest => ({
        position: [dest.lat, dest.lon],
        title: dest.name,
        type: dest.type,
        // Déterminer une couleur différente selon le type
        color: dest.type === 'activite' ? 'green' :
               dest.type === 'lieu' ? 'blue' :
               dest.type === 'restaurant' ? 'orange' : 'gray',
        // Déterminer une icône selon le type
        icon: dest.type === 'activite' ? '🎯' :
              dest.type === 'lieu' ? '🏛️' :
              dest.type === 'restaurant' ? '🍽️' : '📍',
        // Ajouter l'heure si disponible
        time: dest.heureDebutStr ? dest.heureDebutStr : null
      }));
  
    return {
      markers,
      hotelCoords: hotelCoords ? [hotelCoords.lat, hotelCoords.lon] : null
    };
  };
  
  // 3. Ajoutez une fonction pour ouvrir la modal avec la carte
  // Fonction sécurisée pour ouvrir la carte
const openMapPreview = (day) => {
  if (!day) {
    console.warn("Jour non défini pour l'aperçu de la carte");
    // Ouvrir quand même la modal mais avec des données vides
    setSelectedDayMarkers([]);
    setSelectedDayHotel(null);
    setShowMapModal(true);
    return;
  }
  
  try {
    const { markers, hotelCoords } = prepareMapDataForDay(day);
    setSelectedDayMarkers(markers || []);
    setSelectedDayHotel(hotelCoords);
    setShowMapModal(true);
  } catch (error) {
    console.error("Erreur lors de la préparation des données de carte:", error);
    // En cas d'erreur, on ouvre quand même la modal avec des données vides
    setSelectedDayMarkers([]);
    setSelectedDayHotel(null);
    setShowMapModal(true);
  }
};
  
  // 4. Créez un composant modal pour afficher la carte
 

  // Effet unique pour l'initialisation de l'application
  useEffect(() => {
    // Éviter les exécutions multiples
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

  // Effet pour compiler les destinations - ne se déclenche qu'une fois après chargement
  useEffect(() => {
    // Ne s'exécute que quand loading passe à false
    if (!loading && dataLoaded.current && !coordsCompiled.current &&
      (hotels.length > 0 || activites.length > 0 || lieux.length > 0 || restaurants.length > 0)) {
      compileDestinationsWithCoordinates();
    }
  }, [loading]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        console.log("🟢 Début de la récupération des données");

        // Stocker l'ID utilisateur dans le state

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        let userId;
        if (user && user.id) {
          userId = user.id;  // Utilise l'ID de l'utilisateur connecté
        } else {
          userId = "65c55e51-915b-41b1-9bba-b6d241b193aa"; // Valeur en dur si l'utilisateur n'est pas connecté
        }

        setUserId(userId);

        // Étape 1 : Récupérer l'ID du formulaire et la destination
        const { data: formData, error: formError } = await supabase
          .from('quiz_responses')
          .select('id, destination, user_id')
          .eq('user_id', userId)  // Utilisation de l'ID déterminé
          .order('created_at', { ascending: false })
          .limit(1);

        if (formError) {
          console.error("Erreur lors de la récupération du formulaire :", formError.message);
        } else {
          console.log("Formulaire récupéré :", formData);
        }

        if (!formData || formData.length === 0) {
          console.warn("⚠️ Aucune réponse trouvée dans quiz_responses");
          return;
        }

        const { id, destination: rawDestination, user_id } = formData[0];
        console.log("🔍 Données du formulaire récupérées:", { id, rawDestination, user_id });

        // Formatage de la destination
        const formattedDestination = capitalizeFirstLetter(rawDestination);

        console.log("🌍 Destination formatée:", formattedDestination);

        // Étape 2 : Récupérer l'ID de la destination
        const { data: destData, error: destError } = await supabase
          .from('destinations')
          .select('id')
          .eq('name', formattedDestination)
          .single();

        if (destError) {
          console.error("❌ Erreur lors de la récupération de l'ID de destination:", destError);
          console.log("🕵️ Destinations disponibles (vérification):");
          const { data: allDestinations } = await supabase.from('destinations').select('name');
          console.log(allDestinations);
          return;
        }

        if (!destData) {
          console.warn(`⚠️ Aucune destination trouvée pour ${formattedDestination}`);
          return;
        }

        const destinationId = destData.id;
        console.log("🆔 ID de destination récupéré:", destinationId);

        // Étape 3 : Récupérer toutes les données
        const { data: descData, error: descError } = await supabase
          .from('destinations_description')
          .select('gastronomie')
          .eq('destination_id', destinationId)
          .single();

        if (descError) {
          console.error("❌ Erreur lors de la récupération de la description:", descError);
          return;
        }

        if (!descData) {
          console.warn("⚠️ Aucune donnée de description trouvée");
          return;
        }

        console.log("📦 Données complètes récupérées:", descData);

        // Traitement des horaires de repas
        const rawGastronomie = descData.gastronomie || {};
        let mealtimesArray = [];

        // Vérifier si horaires_repas existe et extraire les horaires
        if (rawGastronomie.horaires_repas) {
          if (typeof rawGastronomie.horaires_repas === 'string') {
            // Si c'est une chaîne, on essaie d'extraire les horaires avec des expressions régulières
            const timeRegex = /(\d{1,2}[h:]\d{0,2})\s*-\s*(\d{1,2}[h:]\d{0,2})/g;
            let match;
            while ((match = timeRegex.exec(rawGastronomie.horaires_repas)) !== null) {
              mealtimesArray.push({
                debut: match[1],
                fin: match[2]
              });
            }

            // Si aucune correspondance n'a été trouvée, on conserve la chaîne originale
            if (mealtimesArray.length === 0) {
              mealtimesArray = [rawGastronomie.horaires_repas];
            }
          } else if (typeof rawGastronomie.horaires_repas === 'object') {
            // Si c'est déjà un objet ou un tableau, on l'utilise directement ou on l'adapte
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

              // Si aucun repas spécifique n'est trouvé, utiliser les clés disponibles
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
        setGastronomie(mealtimesArray); // On stocke maintenant un tableau des horaires

      } catch (error) {
        console.error("❌ Erreur globale lors de la récupération des données:", error);
      }
    };
    fetchFormData();
  }, []);

  // Effet pour planifier le voyage - ne se déclenche qu'une fois quand les données sont prêtes
  useEffect(() => {
    if (!loading &&
      coordsCompiled.current &&
      !tripPlanned.current &&
      allDestinationsWithCoords.length > 0 &&
      hotels.length > 0 &&
      totalNights > 0) {
      planTrip();
    }
    console.log("Photos : ", allDestinationsWithCoords);
  }, [loading, allDestinationsWithCoords.length]);


  useEffect(() => {
    // Fonction pour redessiner les bannières lors du redimensionnement de la fenêtre
    const handleResize = () => {
      // Déclencher l'événement datesSet du calendrier pour recalculer les bannières
      if (calendarRef.current && calendarRef.current.getApi) {
        // Supprimer les bannières existantes
        document.querySelectorAll('.hotel-banner-span').forEach(el => el.remove());

        // Petit délai avant de recréer les bannières
        setTimeout(() => {
          // Code similaire à celui de datesSet
          const hotelStays = [];
          let currentStay = null;

          const dayCells = Array.from(document.querySelectorAll('[data-hotel]'))
            .sort((a, b) => a.getAttribute('data-date').localeCompare(b.getAttribute('data-date')));

          // Regrouper les jours consécutifs avec le même hôtel
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

          // Créer les bannières (même code que dans datesSet)
          hotelStays.forEach(stay => {
            // ... le reste du code pour créer les bannières
            // Insérez ici le même code que dans la fonction datesSet
          });
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
      <h1>Planning de Voyage</h1>
      <h2>Horaires des Repas</h2>
      {/* {dailyPlanning.length > 0 && (
        <div className="daily-planning">
          <h2>Planning Journalier</h2>
          {dailyPlanning
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((day, index) => (
              <div key={index} className="daily-plan">
                <h3>Jour {index + 1} - {day.date} - Hôtel: {day.hotel}</h3>
                  
                {day.destinations && day.destinations.length > 0 ? (
                  <ul className="day-activities">
                    {day.destinations
                      .filter(dest => dest.type !== 'hotel')
                      .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0))
                      .map((dest, destIndex) => (
                        <li key={destIndex} className={`activity-type-${dest.type}`}>
                          {/* Horaires de l'activité }
                          {dest.heureDebutStr && dest.heureFinStr
                            ? `(${dest.heureDebutStr} - ${dest.heureFinStr}) `
                            : ''}

                          { Icône selon le type }
                          {dest.type === 'activite' ? '🎯 ' :
                            dest.type === 'lieu' ? '🏛️ ' :
                              dest.type === 'restaurant' ? '🍽️ ' : '📍 '}

                          { Nom de la destination }
                          {dest.name}

                          { Infos sur le trajet depuis le point précédent }
                          {dest.routeFromPrevious && (
                            <div className="route-info">
                              <p>
                                🚶‍♂️ {dest.previousLocation} → {dest.name}:
                                {dest.departPreviousStr ? ` Départ à ${dest.departPreviousStr}, ` : ''}
                                {dest.routeFromPrevious.distance.toFixed(1)} km
                                ({Math.floor(dest.routeFromPrevious.duration / 60)}h
                                {dest.routeFromPrevious.duration % 60 > 0
                                  ? dest.routeFromPrevious.duration % 60 + 'min'
                                  : ''})
                              </p>
                            </div>
                          )}

                          { Infos sur le retour à l'hôtel (pour la dernière destination) }
                          {dest.routeToHotel && (
                            <div className="route-info">
                              <p>
                                🏠 {dest.name} → Hôtel:
                                {dest.retourHotelStr ? ` Arrivée à ${dest.retourHotelStr}, ` : ''}
                                {dest.routeToHotel.distance.toFixed(1)} km
                                ({Math.floor(dest.routeToHotel.duration / 60)}h
                                {dest.routeToHotel.duration % 60 > 0
                                  ? dest.routeToHotel.duration % 60 + 'min'
                                  : ''})
                              </p>
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>Aucune destination planifiée pour ce jour.</p>
                )}
              </div>
            ))}
        </div>
      )} */}

      {dailyPlanning.length > 0 && (
        <div className="daily-planning">
          <h2>Planning Journalier</h2>
          {dailyPlanning
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((day, index) => {
              // Calculer l'itinéraire optimisé pour ce jour
              const itinerary = generateOptimizedItinerary(day, transportMode, allDestinationsWithCoords);

              return (
                <div key={index} className="daily-plan">
                  <h3>Jour {index + 1} - {day.date} - Hôtel: {day.hotel}</h3>

                  {/* Remplacez votre section de boutons d'itinéraire par celui-ci */}
<div className="itinerary-buttons">
  {/* Bouton pour afficher la carte */}
  <button
    onClick={() => openMapPreview(day)}
    className="map-button"
  >
    <span className="btn-icon">🗺️</span>
    <span className="btn-text">
      Voir la carte des destinations
      {itinerary.count > 0 && (
        <span className="btn-details">
          {" - "}{itinerary.count} destination{itinerary.count > 1 ? 's' : ''}
        </span>
      )}
    </span>
  </button>

  {/* Bouton direct vers Google Maps */}
  {itinerary.count > 0 && (
    <a
      href={itinerary.url}
      target="_blank"
      rel="noopener noreferrer"
      className="maps-button"
    >
      <span className="btn-icon">🔗</span>
      <span className="btn-text">
        Ouvrir dans Google Maps
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
</div>

                  {/* Contenu des destinations (conservez votre code existant ici) */}
                  {day.destinations && day.destinations.length > 0 ? (
                    <ul className="day-activities">
                      {/* ... votre code existant ... */}
                    </ul>
                  ) : (
                    <p>Aucune destination planifiée pour ce jour.</p>
                  )}
                </div>
              );
            })}

         

          {/* Styles CSS */}
          <style jsx>{`
      .itinerary-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 15px 0;
      }
      
      .map-button, .maps-button {
        display: inline-flex;
        align-items: center;
        padding: 10px 16px;
        border-radius: 4px;
        font-weight: bold;
        text-decoration: none;
        transition: background-color 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
      
      .map-button {
        background-color: #4285F4;
        color: white;
        border: none;
      }
      
      .map-button:hover {
        background-color: #3b77db;
      }
      
      .maps-button {
        background-color: #1a73e8;
        color: white;
      }
      
      .maps-button:hover {
        background-color: #0d62d0;
      }
      
      .btn-icon {
        font-size: 1.4em;
        margin-right: 8px;
      }
      
      .btn-text {
        font-size: 1em;
      }
      
      .btn-details {
        font-weight: normal;
        opacity: 0.9;
      }
      
      /* ... vos autres styles ... */
    `}</style>
        </div>
      )}

      {loading && <div>Chargement de votre planning...</div>}

      {quizResponse && (
        <div className="trip-details">
          <h2>Détails du Voyage</h2>
          <p>Date de départ: {quizResponse.departure_date}</p>
          <p>Date de retour: {quizResponse.return_date}</p>
          <p>Nombre total de nuits: {totalNights}</p>
          <p>Intensité des journées: {nbIntensity} activité(s) par jour</p>

          {quizResponse.budget_allocation && (
            <div>
              <h3>Allocation Budgétaire</h3>
              <ul>
                <li>Activités: {quizResponse.budget_allocation.activites}</li>
                <li>Transport: {quizResponse.budget_allocation.transport}</li>
                <li>Restaurants: {quizResponse.budget_allocation.restaurant}</li>
                <li>Hébergement: {quizResponse.budget_allocation.hebergement}</li>
              </ul>

              <h3>Mode de Transport</h3>
              <p>Mode recommandé: {transportMode}</p>
            </div>
          )}
        </div>
      )}

      {hotelNights.length > 0 && (
        <div className="hotel-distribution">
          <h2>Répartition des Nuits</h2>
          {hotelNights.map((hotel, index) => (
            <div key={index} className="hotel-night-item">
              <p>{hotel.name} - {hotel.nights} nuit(s)</p>
            </div>
          ))}
        </div>
      )}

      {hotelsWithDates.length > 0 && (
        <div className="hotel-dates">
          <h2>Séjours dans les Hôtels</h2>
          {hotelsWithDates.map((hotel, index) => (
            <div key={index} className="hotel-date-item">
              <p>
                {hotel.name} - {hotel.nights} nuit(s)
                {hotel.startDate && hotel.endDate && ` (Du ${hotel.startDate} au ${hotel.endDate})`}
              </p>
            </div>
          ))}
        </div>
      )}

      {allDestinationsWithCoords.length > 0 && (
        <div className="destinations-list">
          <h2>Liste des Destinations</h2>
          {allDestinationsWithCoords
            .sort((a, b) => (a.visitDate || '').localeCompare(b.visitDate || ''))
            .map((destination, index) => (
              <div key={index} className="destination-item">
                <p>
                  Destination: {destination.name} Type :
                  {destination.type && ` (${destination.type})`} Hotel :
                  {destination.nom_hotel && ` - Hôtel: ${destination.photo}`} Date :
                  {destination.visitDate && ` - Date de visite: ${destination.visitDate}`}

                </p>
              </div>
            ))}
        </div>
      )}

      {dailyPlanning.length > 0 && (
        <div className="daily-planning">
          <h2>Planning Journalier</h2>
          {dailyPlanning
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((day, index) => (
              <div key={index} className="daily-plan">
                <h3>Jour {index + 1} - {day.date} - Hôtel: {day.hotel}</h3>
                {day.destinations && day.destinations.length > 0 ? (
                  <ul className="day-activities">
                    {day.destinations.map((dest, destIndex) => (
                      <li key={destIndex} className={`activity-type-${dest.type}`}>
                        {dest.type === 'activite' ? '🎯 ' :
                          dest.type === 'lieu' ? '🏛️ ' :
                            dest.type === 'restaurant' ? '🍽️ ' : '📍 '}
                        {dest.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune destination planifiée pour ce jour.</p>
                )}
              </div>
            ))}
        </div>
      )}

      {dailyPlanning.length > 0 && (
        <div className="calendar-view">
          <h2>Vue Calendrier</h2>
          <FullCalendar
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
                      start: day.date, // Utiliser directement la date sans T00:00:00
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
                const isTimeGridView =
                  eventInfo.view.type === 'timeGridWeek' ||
                  eventInfo.view.type === 'timeGridDay';

                // Styles pour le container avec image en arrière-plan
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

                // Styles pour l'overlay semi-transparent
                const overlayStyle = {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay noir semi-transparent
                  zIndex: 1
                };

                // Styles pour le texte
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

              return null; // Utiliser le rendu par défaut pour les autres événements
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

                  // Parcourir toutes les cellules pour cet hôtel
                  for (let i = 0; i < cellsForHotel.length; i++) {
                    const currentCell = cellsForHotel[i].cell;
                    const currentDate = new Date(cellsForHotel[i].date);

                    // Si c'est la première cellule ou si les jours ne sont pas consécutifs
                    // (ou si on est au début d'une nouvelle semaine/ligne dans le calendrier)
                    if (i === 0 ||
                      !isConsecutiveDate(cellsForHotel[i - 1].date, cellsForHotel[i].date) ||
                      currentCell.parentElement !== cellsForHotel[i - 1].cell.parentElement) {

                      // Ajouter une nouvelle bannière
                      const banner = document.createElement('div');
                      banner.className = 'hotel-banner';
                      banner.innerHTML = `🏨 ${hotel}`;
                      banner.style.backgroundColor = '#c0c0c0';
                      banner.style.color = 'white';

                      // Ajouter à la cellule
                      const dayTop = currentCell.querySelector('.fc-daygrid-day-top');
                      if (dayTop) {
                        dayTop.after(banner);
                      } else {
                        currentCell.insertBefore(banner, currentCell.firstChild);
                      }

                      // Si ce n'est pas la dernière cellule et que le jour suivant est consécutif
                      // et dans la même ligne du calendrier
                      let consecutiveDays = 1;
                      let lastConsecutiveIdx = i;

                      while (lastConsecutiveIdx + 1 < cellsForHotel.length) {
                        const nextDate = new Date(cellsForHotel[lastConsecutiveIdx + 1].date);
                        const nextCell = cellsForHotel[lastConsecutiveIdx + 1].cell;

                        // Vérifier si le jour suivant est consécutif
                        const currentDate = new Date(cellsForHotel[lastConsecutiveIdx].date);
                        currentDate.setDate(currentDate.getDate() + 1);

                        // Vérifier aussi qu'ils sont dans la même ligne (même parent)
                        if (currentDate.getTime() === nextDate.getTime() &&
                          nextCell.parentElement === currentCell.parentElement) {
                          consecutiveDays++;
                          lastConsecutiveIdx++;
                        } else {
                          break;
                        }
                      }

                      // Si plus d'un jour consécutif, élargir la bannière
                      if (consecutiveDays > 1) {
                        const lastCell = cellsForHotel[lastConsecutiveIdx].cell;

                        // Modifier la bannière pour qu'elle s'étende sur plusieurs jours
                        banner.classList.add('hotel-banner-span');

                        // Calculer la largeur en fonction du nombre de cellules
                        const cellWidth = currentCell.offsetWidth;
                        banner.style.width = `${cellWidth * consecutiveDays - 10}px`;

                        console.log(`Bannière pour ${hotel} étendue sur ${consecutiveDays} jours consécutifs`);

                        // Sauter les cellules déjà couvertes
                        i = lastConsecutiveIdx;
                      }
                    }
                  }
                });
              }, 300);
            }}

          />
          
{/* Ajoutez la modal de prévisualisation de carte à la fin du composant PlanningPage */}
<MapPreviewModal 
  isOpen={showMapModal}
  onClose={() => setShowMapModal(false)}
  markers={selectedDayMarkers}
  hotelCoords={selectedDayHotel}
  dayDate={dailyPlanning.find(day => 
    day.destinations.some(dest => 
      selectedDayMarkers.some(m => 
        m.title === dest.name && m.type === dest.type
      )
    )
  )?.date || ""}
/>

          <style jsx>{`

        .map-button {
  background-color: #4285F4;
  color: white;
  border: none;
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.map-button:hover {
  background-color: #3b77db;
}

      .calendar-view {
        margin-top: 30px;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

     :global(.hotel-banner) {
  background-color: #c0c0c0 !important;
  color: white !important;
  border-left: 3px solid darkred !important;
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
  border-right: 3px solid darkred !important;
  position: relative;
  margin-right: -10px;
}

/* Ces styles assurent que les conteneurs de FullCalendar permettent le débordement */
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

/* Assurer que les bannières restent visibles même avec d'autres éléments */
      
      /* Styles pour améliorer l'apparence du calendrier */
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
      
      /* Style pour les événements de repas */
      :global(.fc-event-time) {
        font-weight: bold;
      }
  
  /* Pour s'assurer que la bannière s'adapte correctement dans différentes vues */
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
      )}
    </div>

  );
}