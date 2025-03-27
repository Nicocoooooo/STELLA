import React from 'react';

/**
 * Composant de modal pour prévisualiser l'itinéraire avant ouverture dans Google Maps
 */
const RoutePreviewModal = ({ isOpen, onClose, dayPlan, transportMode }) => {
  if (!isOpen) return null;
  
  // Calculer la durée totale estimée des trajets
  const calculateTotalDuration = () => {
    let total = 0;
    
    dayPlan.destinations.forEach(dest => {
      if (dest.routeFromPrevious) {
        total += dest.routeFromPrevious.duration;
      }
      if (dest.routeToHotel) {
        total += dest.routeToHotel.duration;
      }
    });
    
    return total;
  };
  
  // Formater la durée en heures et minutes
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };
  
  // Calculer la distance totale
  const calculateTotalDistance = () => {
    let total = 0;
    
    dayPlan.destinations.forEach(dest => {
      if (dest.routeFromPrevious) {
        total += dest.routeFromPrevious.distance;
      }
      if (dest.routeToHotel) {
        total += dest.routeToHotel.distance;
      }
    });
    
    return total.toFixed(1);
  };
  
  // Générer le lien Google Maps
  const generateMapLink = () => {
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
  
  // Destinations triées par ordre
  const sortedDestinations = [...dayPlan.destinations]
    .filter(dest => dest.type !== 'hotel')
    .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0));
  
  // Icônes pour les modes de transport
  const transportIcon = {
    'driving': '🚗',
    'walking': '🚶',
    'bicycle': '🚲'
  }[transportMode] || '🚗';
  
  return (
    <div className="route-preview-overlay">
      <div className="route-preview-modal">
        <div className="route-preview-header">
          <h3>Aperçu de l'itinéraire - {dayPlan.date}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="route-preview-content">
          <div className="route-summary">
            <div className="route-detail">
              <span className="detail-label">Mode de transport:</span>
              <span className="detail-value">{transportIcon} {transportMode === 'driving' ? 'Voiture' : transportMode === 'walking' ? 'À pied' : 'Vélo'}</span>
            </div>
            <div className="route-detail">
              <span className="detail-label">Distance totale:</span>
              <span className="detail-value">{calculateTotalDistance()} km</span>
            </div>
            <div className="route-detail">
              <span className="detail-label">Durée estimée:</span>
              <span className="detail-value">{formatDuration(calculateTotalDuration())}</span>
            </div>
            <div className="route-detail">
              <span className="detail-label">Nombre d'étapes:</span>
              <span className="detail-value">{sortedDestinations.length}</span>
            </div>
          </div>
          
          <div className="route-steps">
            <div className="step hotel-step">
              <div className="step-time">Départ</div>
              <div className="step-icon">🏨</div>
              <div className="step-name">{dayPlan.hotel} (Hôtel)</div>
            </div>
            
            {sortedDestinations.map((dest, index) => (
              <div key={index} className={`step ${dest.type}-step`}>
                <div className="step-time">{dest.heureDebutStr || ''}</div>
                <div className="step-icon">
                  {dest.type === 'activite' ? '🎯' :
                    dest.type === 'lieu' ? '🏛️' :
                      dest.type === 'restaurant' ? '🍽️' : '📍'}
                </div>
                <div className="step-name">{dest.name}</div>
                {dest.routeFromPrevious && (
                  <div className="step-route">
                    {transportIcon} {dest.routeFromPrevious.distance.toFixed(1)} km 
                    ({formatDuration(dest.routeFromPrevious.duration)})
                  </div>
                )}
              </div>
            ))}
            
            <div className="step hotel-step">
              <div className="step-time">Retour</div>
              <div className="step-icon">🏨</div>
              <div className="step-name">{dayPlan.hotel} (Hôtel)</div>
              {sortedDestinations.length > 0 && sortedDestinations[sortedDestinations.length - 1].routeToHotel && (
                <div className="step-route">
                  {transportIcon} {sortedDestinations[sortedDestinations.length - 1].routeToHotel.distance.toFixed(1)} km 
                  ({formatDuration(sortedDestinations[sortedDestinations.length - 1].routeToHotel.duration)})
                </div>
              )}
            </div>
          </div>
          
          <div className="preview-footer">
            <p className="preview-note">
              L'itinéraire sera ouvert dans Google Maps après avoir cliqué sur le bouton ci-dessous.
              Google Maps pourra optimiser l'ordre des étapes pour vous proposer le trajet le plus efficace.
            </p>
            <a 
              href={generateMapLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="open-maps-button"
            >
              Ouvrir dans Google Maps
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .route-preview-overlay {
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
        
        .route-preview-modal {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .route-preview-header {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .route-preview-header h3 {
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
        
        .route-preview-content {
          padding: 20px;
        }
        
        .route-summary {
          background-color: #f9f9f9;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 20px;
        }
        
        .route-detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .detail-label {
          font-weight: bold;
          color: #555;
        }
        
        .route-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 25px;
        }
        
        .step {
          display: grid;
          grid-template-columns: 60px 30px 1fr;
          grid-template-rows: auto auto;
          gap: 5px;
          padding: 10px;
          border-radius: 6px;
          background-color: #f5f5f5;
          position: relative;
        }
        
        .step::after {
          content: '';
          position: absolute;
          left: 14px;
          bottom: -15px;
          width: 2px;
          height: 20px;
          background-color: #ccc;
          z-index: 1;
        }
        
        .step:last-child::after {
          display: none;
        }
        
        .step-time {
          grid-column: 1;
          grid-row: 1;
          font-size: 0.9rem;
          color: #777;
        }
        
        .step-icon {
          grid-column: 2;
          grid-row: 1 / span 2;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .step-name {
          grid-column: 3;
          grid-row: 1;
          font-weight: bold;
        }
        
        .step-route {
          grid-column: 3;
          grid-row: 2;
          font-size: 0.85rem;
          color: #666;
        }
        
        .hotel-step {
          background-color: #efe;
        }
        
        .restaurant-step {
          background-color: #fff0e0;
        }
        
        .activite-step {
          background-color: #e0f0ff;
        }
        
        .lieu-step {
          background-color: #f5e0ff;
        }
        
        .preview-footer {
          text-align: center;
          margin-top: 20px;
        }
        
        .preview-note {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 15px;
        }
        
        .open-maps-button {
          display: inline-block;
          background-color: #1a73e8;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        
        .open-maps-button:hover {
          background-color: #0d62d0;
        }
      `}</style>
    </div>
  );
};

export default RoutePreviewModal;