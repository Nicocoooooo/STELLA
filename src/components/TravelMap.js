import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import countryCoordinates from '../utils/countryCoordinates';

// Token Mapbox depuis les variables d'environnement
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const TravelMap = ({ destination }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si la destination est disponible
    if (!destination || !destination.country) {
      setError("Informations de destination non disponibles");
      setLoading(false);
      return;
    }

    // Si la carte existe déjà, nettoyer avant de recréer
    if (map.current && map.current._loaded) {
      try {
        if (marker.current) {
          marker.current.remove();
        }
        map.current.remove();
        map.current = null;
      } catch (err) {
        console.error("Erreur lors de la suppression de la carte:", err);
      }
    }
    
    // Traitement spécial pour certaines destinations
    let coordsKey = destination.country;
    
    // Vérifier les destinations spéciales qui ont besoin de coordonnées personnalisées
    if (destination.name === "Alaska") {
      coordsKey = "Alaska";
    } else if (destination.name === "Hawai") {
      coordsKey = "Hawai";
    } else if (destination.name === "Dubai") {
      coordsKey = "Dubai";
    }
    
    // Obtenir les coordonnées appropriées
    const coords = countryCoordinates[coordsKey] || countryCoordinates.default;
    
    try {
      // Initialiser la carte directement avec les coordonnées du pays
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coords.center,
        zoom: coords.zoom,
        interactive: true
      });

      // Ajouter les contrôles de navigation
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Ajouter le marqueur une fois que la carte est chargée
      map.current.on('load', () => {
        // Ajouter un marqueur pour la destination
        marker.current = new mapboxgl.Marker({
          color: "#9557fa"
        })
          .setLngLat(coords.center)
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="text-align: center;">
                <h3 style="margin: 0; font-weight: bold; color: #333;">${destination.name}</h3>
                <p style="margin: 5px 0 0; color: #666;">${destination.country}</p>
              </div>
            `))
          .addTo(map.current);
          
        setLoading(false);
      });
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la carte:', err);
      setError("Impossible de charger la carte");
      setLoading(false);
    }

    // Nettoyage lors du démontage du composant
    return () => {
      if (map.current && map.current._loaded) {
        try {
          if (marker.current) {
            marker.current.remove();
          }
          map.current.remove();
        } catch (err) {
          console.error("Erreur lors de la suppression de la carte:", err);
        }
      }
    };
  }, [destination]); // Dépendance à destination pour recréer la carte si la destination change

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4">
        <h2 className="text-xl text-primary font-bold mb-4">Carte du voyage</h2>
        <div 
          ref={mapContainer} 
          className="w-full rounded-lg overflow-hidden"
          style={{ height: '445px' }}
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

export default TravelMap;