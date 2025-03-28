import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import countryCoordinates from '../utils/countryCoordinates';

// Le token Mapbox devrait venir des variables d'environnement
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MultiDestinationsMap = ({ destinations = [], title = "Mes destinations" }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si des destinations sont disponibles
    if (!destinations || destinations.length === 0) {
      setError("Aucune destination sélectionnée");
      setLoading(false);
      return;
    }

    // Si la carte existe déjà, nettoyer avant de recréer
    if (map.current && map.current._loaded) {
      try {
        // Supprimer tous les marqueurs
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
        
        map.current.remove();
        map.current = null;
      } catch (err) {
        console.error("Erreur lors de la suppression de la carte:", err);
      }
    }

    // Déterminer les coordonnées pour centrer la carte
    // Pour simplifier, on utilise la première destination comme centre initial
    const firstDestCoords = getCoordinates(destinations[0]);
    
    try {
      // Initialiser la carte
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: firstDestCoords.center,
        zoom: 2, // Zoom initial plus éloigné pour voir plusieurs pays
        interactive: true
      });

      // Ajouter les contrôles de navigation
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Attendre que la carte soit chargée pour ajouter les marqueurs
      map.current.on('load', () => {
        // Ajouter un marqueur pour chaque destination
        destinations.forEach(destination => {
          const coords = getCoordinates(destination);
          
          // Créer et ajouter le marqueur
          const marker = new mapboxgl.Marker({
            color: "#9557fa" // Couleur uniforme pour tous les marqueurs
          })
            .setLngLat(coords.center)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="text-align: center;">
                  <h3 style="margin: 0; font-weight: bold; color: #333;">${destination.name || destination}</h3>
                  <p style="margin: 5px 0 0; color: #666;">${destination.country || ''}</p>
                </div>
              `))
            .addTo(map.current);
          
          // Stocker la référence au marqueur pour pouvoir le supprimer plus tard
          markers.current.push(marker);
        });
        
        // Si plusieurs destinations, ajuster la vue pour les inclure toutes
        if (destinations.length > 1) {
          fitMapToMarkers();
        }
        
        setLoading(false);
      });
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la carte:', err);
      setError("Impossible de charger la carte");
      setLoading(false);
    }

    // Fonction pour ajuster la carte pour afficher tous les marqueurs
    function fitMapToMarkers() {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Ajouter chaque destination aux limites
      destinations.forEach(destination => {
        const coords = getCoordinates(destination);
        bounds.extend(coords.center);
      });
      
      // Ajuster la vue avec une marge
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 5
      });
    }

    // Fonction pour obtenir les coordonnées d'une destination
    function getCoordinates(destination) {
      let coordsKey;
      
      // Si c'est un objet avec des propriétés
      if (typeof destination === 'object') {
        // Traitement spécial pour certaines destinations
        if (destination.name === "Alaska") {
          coordsKey = "Alaska";
        } else if (destination.name === "Hawai") {
          coordsKey = "Hawai";
        } else if (destination.name === "Dubai") {
          coordsKey = "Dubai";
        } else {
          coordsKey = destination.country || destination.name;
        }
      } else {
        // Si c'est juste une chaîne de caractères
        coordsKey = destination;
      }
      
      // Retourner les coordonnées ou une valeur par défaut
      return countryCoordinates[coordsKey] || countryCoordinates.default;
    }

    // Nettoyage lors du démontage du composant
    return () => {
      if (map.current && map.current._loaded) {
        try {
          markers.current.forEach(marker => marker.remove());
          map.current.remove();
        } catch (err) {
          console.error("Erreur lors de la suppression de la carte:", err);
        }
      }
    };
  }, [destinations]); // Dépendance au tableau de destinations

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4">
        <h2 className="text-xl text-primary font-bold mb-4">{title}</h2>
        <div 
          ref={mapContainer} 
          className="w-full rounded-lg overflow-hidden"
          style={{ height: '300px' }}
        >
          {loading && (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
              <p className="ml-2 text-gray-600">Chargement de la carte...</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiDestinationsMap;