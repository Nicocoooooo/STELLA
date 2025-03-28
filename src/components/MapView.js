import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Remplacez par votre propre clé API MapBox
mapboxgl.accessToken = 'pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGUtbWFwYm94LXRva2VuIn0.7654321';

const prepareMapDataForDay = (day, allDestinationsWithCoords) => {
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

const MapView = ({ selectedDay, viewport, transportMode,  allDestinationsWithCoords}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  
  // Initialiser la carte
  useEffect(() => {
    if (map.current) return; // La carte existe déjà
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom
    });
    
    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Nettoyer à la démonter
    return () => map.current.remove();
  }, []);
  
  // Mettre à jour la vue quand le viewport change
  useEffect(() => {
    if (!map.current) return;
    
    map.current.setCenter([viewport.longitude, viewport.latitude]);
    map.current.setZoom(viewport.zoom);
  }, [viewport]);
  
  // Gérer les données du jour sélectionné
  useEffect(() => {
    if (!map.current || !selectedDay) return;
    
    // Nettoyer les marqueurs existants
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Préparer les données de la carte
    const mapData = prepareMapDataForDay(selectedDay, allDestinationsWithCoords);
    
    // Créer les marqueurs
    mapData.features.forEach(feature => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = feature.properties.icon;
      el.style.backgroundColor = feature.properties.iconColor;
      
      if (feature.properties.order && feature.properties.type !== 'hotel') {
        const badge = document.createElement('span');
        badge.className = 'marker-badge';
        badge.textContent = feature.properties.order;
        el.appendChild(badge);
      }
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="popup-content">
                <div class="popup-header">${feature.properties.icon} ${feature.properties.name}</div>
                <div class="popup-type">${getTypeName(feature.properties.type)}</div>
                ${feature.properties.time ? `<div class="popup-time">⏰ ${feature.properties.time}</div>` : ''}
              </div>
            `)
        )
        .addTo(map.current);
      
      markersRef.current.push(marker);
    });
    
    // Ajuster la vue pour montrer tous les points
    if (mapData.bounds) {
      map.current.fitBounds(mapData.bounds, { padding: 50 });
    } else if (mapData.features.length > 0) {
      map.current.setCenter(mapData.center);
      map.current.setZoom(12);
    }
    
    // Dessiner l'itinéraire entre les points
    drawRoute(mapData.features, transportMode);
  }, [selectedDay, transportMode]);
  
  // Dessiner l'itinéraire
  const drawRoute = (features, mode) => {
    // Nettoyer les layers existants
    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }
    
    if (features.length < 2) return;
    
    // Trier les features par ordre
    const sortedFeatures = [...features].sort((a, b) => 
      (a.properties.type === 'hotel' ? -1 : a.properties.order) - 
      (b.properties.type === 'hotel' ? -1 : b.properties.order)
    );
    
    // Créer un itinéraire simple reliant tous les points
    const coordinates = sortedFeatures.map(f => f.geometry.coordinates);
    
    // Ajouter l'hôtel comme destination finale si disponible
    const hotelFeature = features.find(f => f.properties.type === 'hotel');
    if (hotelFeature) {
      coordinates.push(hotelFeature.geometry.coordinates);
    }
    
    // Créer la source et la layer pour l'itinéraire
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      }
    });
    
    // Style de l'itinéraire selon le mode de transport
    const colors = {
      'driving': '#1976D2',
      'walking': '#388E3C',
      'bicycle': '#E64A19'
    };
    
    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': colors[mode] || '#757575',
        'line-width': 4,
        'line-dasharray': mode === 'walking' ? [2, 1] : undefined
      }
    });
  };
  
  // Fonction pour obtenir le nom complet du type
  const getTypeName = (type) => {
    switch (type) {
      case 'hotel': return 'Hôtel';
      case 'activite': return 'Activité';
      case 'lieu': return 'Lieu d\'intérêt';
      case 'restaurant': return 'Restaurant';
      default: return 'Destination';
    }
  };
  
  return (
    <div className="map-container">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      {/* Indicateur du mode de transport */}
      <div className="transport-indicator">
        {transportMode === 'driving' ? '🚗' : 
         transportMode === 'bicycle' ? '🚲' : '🚶‍♂️'} 
        {transportMode === 'driving' ? 'En voiture' : 
         transportMode === 'bicycle' ? 'À vélo' : 'À pied'}
      </div>
      
      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
        }
        
        .transport-indicator {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background-color: white;
          padding: 8px 12px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 1;
        }
        
        :global(.custom-marker) {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          border: 2px solid white;
          font-size: 18px;
          position: relative;
          cursor: pointer;
        }
        
        :global(.marker-badge) {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #f44336;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
        }
        
        :global(.popup-content) {
          padding: 10px;
        }
        
        :global(.popup-header) {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        :global(.popup-type) {
          color: #666;
          font-size: 12px;
          margin-bottom: 5px;
        }
        
        :global(.popup-time) {
          color: #1976D2;
          font-size: 12px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MapView;