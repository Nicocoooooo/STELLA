import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
// Importez le CSS de Leaflet dans votre fichier principal ou ici
// import 'leaflet/dist/leaflet.css';

/**
 * Composant de carte pour afficher un itinéraire avec OpenStreetMap et Leaflet
 */
const ItineraireMap = ({ isOpen, onClose, dayPlan, transportMode }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Ajustez les chemins des images Leaflet (nécessaire en React)
  useEffect(() => {
    // Ce code doit être exécuté après l'import de Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);
  
  useEffect(() => {
    // Ne rien faire si la modale n'est pas ouverte
    if (!isOpen || !dayPlan) return;
    
    // Fonction pour initialiser la carte
    const initMap = () => {
      // Si une carte existe déjà, la nettoyer
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      // Récupérer les coordonnées de l'hôtel
      let hotelCoords = null;
      const hotelDest = dayPlan.destinations.find(dest => dest.type === 'hotel');
      if (hotelDest && hotelDest.lat && hotelDest.lon) {
        hotelCoords = [parseFloat(hotelDest.lat), parseFloat(hotelDest.lon)];
      } else {
        // Rechercher l'hôtel par son nom
        // ... Code pour rechercher l'hôtel
        // Par défaut, utiliser des coordonnées génériques
        hotelCoords = [48.8566, 2.3522]; // Paris par défaut
      }
      
      // Initialiser la carte
      const map = L.map(mapRef.current).setView(hotelCoords, 13);
      mapInstanceRef.current = map;
      
      // Ajouter la couche OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Ajouter un marqueur pour l'hôtel
      const hotelIcon = L.divIcon({
        html: '🏨',
        className: 'hotel-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      L.marker(hotelCoords, { icon: hotelIcon })
        .addTo(map)
        .bindPopup(`<b>${dayPlan.hotel}</b><br>Hôtel`);
      
      // Trier les destinations par heure de début
      const sortedDestinations = [...dayPlan.destinations]
        .filter(dest => dest.type !== 'hotel' && dest.lat && dest.lon)
        .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0));
      
      // Si aucune destination, retourner
      if (sortedDestinations.length === 0) return;
      
      // Créer les icônes pour les différents types de destinations
      const icons = {
        activite: L.divIcon({
          html: '🎯',
          className: 'destination-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        }),
        lieu: L.divIcon({
          html: '🏛️',
          className: 'destination-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        }),
        restaurant: L.divIcon({
          html: '🍽️',
          className: 'destination-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      };
      
      // Ajouter des marqueurs pour chaque destination
      const allPoints = [
        hotelCoords,
        ...sortedDestinations.map(dest => {
          const coords = [parseFloat(dest.lat), parseFloat(dest.lon)];
          
          // Ajouter un marqueur
          const icon = icons[dest.type] || L.divIcon({
            html: '📍',
            className: 'destination-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          
          L.marker(coords, { icon })
            .addTo(map)
            .bindPopup(`<b>${dest.name}</b><br>${dest.type}${dest.heureDebutStr ? `<br>${dest.heureDebutStr} - ${dest.heureFinStr}` : ''}`);
          
          return coords;
        }),
        hotelCoords // Retour à l'hôtel
      ];
      
      // Dessiner la ligne entre les points
      const routeColor = transportMode === 'driving' ? '#0066ff' : 
                          transportMode === 'walking' ? '#00cc44' : '#cc0000';
      
      L.polyline(allPoints, { color: routeColor, weight: 3 }).addTo(map);
      
      // Ajuster la vue pour montrer tous les points
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    };
    
    // Initialiser la carte après un court délai pour s'assurer que le conteneur est prêt
    setTimeout(initMap, 100);
    
    // Nettoyage
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, dayPlan, transportMode]);
  
  if (!isOpen) return null;
  
  return (
    <div className="map-modal-overlay">
      <div className="map-modal">
        <div className="map-header">
          <h3>Itinéraire - {dayPlan.date}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div ref={mapRef} className="map-container"></div>
        
        <div className="map-footer">
          <a 
            href={generateGoogleMapsLink(dayPlan, transportMode)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="google-maps-button"
          >
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>
      
      <style jsx>{`
        .map-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .map-modal {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 800px;
          height: 90vh;
          max-height: 800px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .map-header {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .map-header h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          color: #555;
        }
        
        .map-container {
          flex-grow: 1;
          min-height: 300px;
          width: 100%;
        }
        
        .map-footer {
          padding: 15px 20px;
          border-top: 1px solid #eee;
          text-align: center;
        }
        
        .google-maps-button {
          display: inline-block;
          background-color: #1a73e8;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        
        .google-maps-button:hover {
          background-color: #0d62d0;
        }
        
        /* Styles spécifiques à Leaflet */
        :global(.hotel-icon),
        :global(.destination-icon) {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

/**
 * Fonction utilitaire pour générer un lien Google Maps avec l'itinéraire
 */
const generateGoogleMapsLink = (dayPlan, transportMode) => {
  if (!dayPlan || !dayPlan.destinations) return "#";
  
  // Récupérer les coordonnées de l'hôtel
  let hotelCoords = null;
  const hotelDest = dayPlan.destinations.find(dest => dest.type === 'hotel');
  if (hotelDest && hotelDest.lat && hotelDest.lon) {
    hotelCoords = { lat: hotelDest.lat, lon: hotelDest.lon };
  } else {
    return "#";
  }
  
  // Trier les destinations par heure de début
  const sortedDestinations = [...dayPlan.destinations]
    .filter(dest => dest.type !== 'hotel' && dest.lat && dest.lon)
    .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0));
  
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
  let url = `https://www.google.com/maps/dir/?api=1&origin=${hotelCoords.lat},${hotelCoords.lon}`;
  url += `&destination=${hotelCoords.lat},${hotelCoords.lon}`;
  
  if (sortedDestinations.length > 0) {
    url += `&waypoints=`;
    const waypoints = sortedDestinations.map(dest => `${dest.lat},${dest.lon}`).join('|');
    url += encodeURIComponent(waypoints);
  }
  
  url += `&travelmode=${gmapsMode}`;
  url += `&waypoints_opt=optimize:true`;
  
  return url;
};

export default ItineraireMap;