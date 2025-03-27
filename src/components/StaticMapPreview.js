import React from 'react';

const StaticMapPreview = ({ dayPlan, transportMode, onClose }) => {
    // Extraire les coordonnées de l'hôtel et des destinations
    let hotelCoords = null;
    
    try {
      const hotelDest = dayPlan.destinations.find(dest => dest.type === 'hotel');
      
      if (hotelDest && hotelDest.lat && hotelDest.lon) {
        hotelCoords = { 
          lat: parseFloat(hotelDest.lat), 
          lon: parseFloat(hotelDest.lon) 
        };
      } else {
        // Rechercher par nom d'hôtel si disponible
        const destinations = dayPlan.destinations || [];
        for (const dest of destinations) {
          if (dest.name === dayPlan.hotel && dest.lat && dest.lon) {
            hotelCoords = { 
              lat: parseFloat(dest.lat), 
              lon: parseFloat(dest.lon) 
            };
            break;
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction des coordonnées de l'hôtel:", error);
    }
    
    // Extraire les destinations triées par heure
    const sortedDestinations = [];
    
    try {
      if (dayPlan && dayPlan.destinations && Array.isArray(dayPlan.destinations)) {
        sortedDestinations.push(
          ...dayPlan.destinations
            .filter(dest => dest.type !== 'hotel' && dest.lat && dest.lon)
            .sort((a, b) => (a.heureDebut || 0) - (b.heureDebut || 0))
            .map(dest => ({
              name: dest.name,
              type: dest.type,
              lat: parseFloat(dest.lat),
              lon: parseFloat(dest.lon),
              time: dest.heureDebutStr || ''
            }))
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction des destinations:", error);
    }
    
    // Générer le lien Google Maps pour l'itinéraire complet
    const generateGoogleMapsLink = () => {
      if (!hotelCoords && sortedDestinations.length === 0) return "#";
      
      // Si nous n'avons pas les coordonnées de l'hôtel mais des destinations
      if (!hotelCoords && sortedDestinations.length > 0) {
        const firstDest = sortedDestinations[0];
        // Utiliser la première destination comme origine
        return `https://www.google.com/maps/search/?api=1&query=${firstDest.lat},${firstDest.lon}`;
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
      
      return url;
    };
    
    // Générer l'URL pour l'iframe OpenStreetMap
    const generateMapEmbedUrl = () => {
      // Collecter tous les points valides
      const points = [];
      if (hotelCoords) points.push(hotelCoords);
      sortedDestinations.forEach(dest => {
        points.push({ lat: dest.lat, lon: dest.lon });
      });
      
      // Si nous n'avons pas de points, retourner une URL par défaut
      if (points.length === 0) {
        return "https://www.openstreetmap.org/export/embed.html?bbox=-10.0,35.0,30.0,60.0&layer=mapnik";
      }
      
      // Calculer les bornes de la carte
      let minLat = points[0].lat;
      let maxLat = points[0].lat;
      let minLon = points[0].lon;
      let maxLon = points[0].lon;
      
      points.forEach(point => {
        minLat = Math.min(minLat, point.lat);
        maxLat = Math.max(maxLat, point.lat);
        minLon = Math.min(minLon, point.lon);
        maxLon = Math.max(maxLon, point.lon);
      });
      
      // Ajouter une marge
      const latMargin = (maxLat - minLat) * 0.1 || 0.01;
      const lonMargin = (maxLon - minLon) * 0.1 || 0.01;
      
      minLat -= latMargin;
      maxLat += latMargin;
      minLon -= lonMargin;
      maxLon += lonMargin;
      
      // Construire l'URL de l'iframe
      let url = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik`;
      
      // Ajouter le marqueur de l'hôtel si disponible
      if (hotelCoords) {
        url += `&marker=${hotelCoords.lat},${hotelCoords.lon}`;
      }
      
      return url;
    };
    
    // Ouvrir le lien Google Maps dans un nouvel onglet
    const openGoogleMaps = () => {
      const url = generateGoogleMapsLink();
      if (url !== "#") {
        window.open(url, '_blank');
      }
    };
    
    return (
      <div className="map-overlay">
        <div className="map-modal">
          <div className="map-header">
            <h3>Itinéraire du {dayPlan.date}</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          
          <div className="map-content">
            <div className="map-container">
              <iframe 
                width="100%" 
                height="400" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={generateMapEmbedUrl()}
                title={`Carte du ${dayPlan.date}`}
              ></iframe>
              <div className="map-info">
                <span className="map-notice">Les marqueurs indiquent les points d'intérêt approximatifs.</span>
              </div>
            </div>
            
            <div className="itinerary-info">
              <h4>Points d'intérêt :</h4>
              
              {(!hotelCoords && sortedDestinations.length === 0) ? (
                <div className="no-data-message">
                  Aucune information de géolocalisation disponible pour ce jour.
                </div>
              ) : (
                <div className="itinerary-list">
                  {hotelCoords && (
                    <div className="itinerary-item hotel-item">
                      <div className="item-icon hotel-icon">🏨</div>
                      <div className="item-details">
                        <div className="item-name">{dayPlan.hotel}</div>
                        <div className="item-type">Hôtel (Départ et Arrivée)</div>
                      </div>
                    </div>
                  )}
                  
                  {sortedDestinations.map((dest, index) => (
                    <div key={index} className={`itinerary-item ${dest.type}-item`}>
                      <div className={`item-icon ${dest.type}-icon`}>
                        {dest.type === 'restaurant' ? '🍽️' : 
                         dest.type === 'activite' ? '🎯' : 
                         dest.type === 'lieu' ? '🏛️' : '📍'}
                      </div>
                      <div className="item-details">
                        <div className="item-name">{dest.name}</div>
                        <div className="item-type">
                          {dest.type === 'restaurant' ? 'Restaurant' : 
                           dest.type === 'activite' ? 'Activité' : 
                           dest.type === 'lieu' ? 'Lieu d\'intérêt' : dest.type}
                          {dest.time ? ` (${dest.time})` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="map-footer">
            <p>Pour obtenir des directions détaillées:</p>
            <button 
              onClick={openGoogleMaps} 
              className="google-maps-button"
              disabled={!hotelCoords && sortedDestinations.length === 0}
            >
              Ouvrir avec Google Maps
            </button>
          </div>
        </div>
        
        <style jsx>{`
          .map-overlay {
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
            max-width: 900px;
            max-height: 90vh;
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
            font-weight: 600;
          }
          
          .close-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            color: #555;
          }
          
          .map-content {
            padding: 0;
            overflow-y: auto;
            max-height: calc(90vh - 130px);
          }
          
          .map-container {
            width: 100%;
            position: relative;
          }
          
          .map-info {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          }
          
          .itinerary-info {
            padding: 20px;
          }
          
          .itinerary-info h4 {
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 1.1rem;
          }
          
          .no-data-message {
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 4px;
            color: #666;
            font-style: italic;
            text-align: center;
          }
          
          .itinerary-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .itinerary-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-radius: 4px;
            background-color: #f8f9fa;
            border-left: 4px solid #ddd;
          }
          
          .hotel-item {
            border-left-color: #9C27B0;
          }
          
          .restaurant-item {
            border-left-color: #FF9800;
          }
          
          .activite-item {
            border-left-color: #4CAF50;
          }
          
          .lieu-item {
            border-left-color: #2196F3;
          }
          
          .item-icon {
            font-size: 1.5rem;
            margin-right: 15px;
            width: 30px;
            text-align: center;
          }
          
          .item-details {
            flex-grow: 1;
          }
          
          .item-name {
            font-weight: bold;
          }
          
          .item-type {
            font-size: 0.9rem;
            color: #666;
          }
          
          .map-footer {
            padding: 15px 20px;
            border-top: 1px solid #eee;
            text-align: center;
          }
          
          .map-footer p {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 0.9rem;
            color: #666;
          }
          
          .google-maps-button {
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 20px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .google-maps-button:hover {
            background-color: #0d62d0;
          }
          
          .google-maps-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    );
  };
  
export default StaticMapPreview;