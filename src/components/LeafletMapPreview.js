// components/LeafletMapPreview.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Assurez-vous d'avoir des icônes pour les marqueurs
// Ici on utilise un style simple avec des cercles de couleur
const createCustomIcon = (color, text) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5); color: white; font-weight: bold; font-size: 12px;">${text}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Icône spéciale pour l'hôtel
const hotelIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #9C27B0; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5); color: white; font-weight: bold;">🏨</div>`,
  iconSize: [35, 35],
  iconAnchor: [17, 17]
});

const LeafletMapPreview = ({ markers, hotelPosition, height = '400px' }) => {
  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]); // Paris par défaut
  const [allPositions, setAllPositions] = useState([]);
  const [path, setPath] = useState([]);

  useEffect(() => {
    // Combiner l'hôtel et toutes les destinations pour calculer le centre de la carte
    const positions = [];
    if (hotelPosition) {
      positions.push(hotelPosition);
    }
    
    markers.forEach(marker => {
      positions.push(marker.position);
    });
    
    setAllPositions(positions);
    
    // Si on a l'hôtel et des marqueurs, on crée un chemin qui commence et finit à l'hôtel
    if (hotelPosition && markers.length > 0) {
      const sortedMarkers = [...markers].sort((a, b) => {
        // Si on a des heures, trier par heure
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return 0; // Pas de tri spécifique sans heures
      });
      
      // Créer le chemin: hôtel -> destinations dans l'ordre -> retour à l'hôtel
      const routePath = [hotelPosition];
      sortedMarkers.forEach(marker => {
        routePath.push(marker.position);
      });
      routePath.push(hotelPosition);
      
      setPath(routePath);
    }
    
    // Calculer le centre de la carte
    if (positions.length > 0) {
      const sumLat = positions.reduce((sum, pos) => sum + pos[0], 0);
      const sumLng = positions.reduce((sum, pos) => sum + pos[1], 0);
      setMapCenter([sumLat / positions.length, sumLng / positions.length]);
    }
  }, [markers, hotelPosition]);
  
  // Calculer le zoom automatique
  const getBounds = () => {
    if (allPositions.length <= 1) return null;
    
    const bounds = L.latLngBounds(allPositions);
    return bounds;
  };

  if (allPositions.length === 0) {
    return <div style={{ height, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      Aucune destination à afficher
    </div>;
  }

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={12} 
      style={{ height, width: '100%' }}
      bounds={getBounds()}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Itinéraire sous forme de ligne */}
      {path.length > 1 && (
        <Polyline 
          positions={path}
          color="#3388ff"
          weight={3}
          opacity={0.7}
          dashArray="5, 10"
        />
      )}
      
      {/* Marqueur pour l'hôtel */}
      {hotelPosition && (
        <Marker position={hotelPosition} icon={hotelIcon}>
          <Popup>
            <strong>Hôtel</strong>
          </Popup>
        </Marker>
      )}
      
      {/* Marqueurs pour les destinations */}
      {markers.map((marker, index) => (
        <Marker 
          key={`${marker.title}-${index}`}
          position={marker.position} 
          icon={createCustomIcon(marker.color, marker.icon)}
        >
          <Popup>
            <div>
              <strong>{marker.title}</strong><br />
              Type: {marker.type}<br />
              {marker.time && `Heure: ${marker.time}`}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMapPreview;