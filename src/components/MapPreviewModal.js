// components/MapPreviewModal.js
import React from 'react';
import LeafletMapPreview from '../components/LeafletMapPreview';

const MapPreviewModal = ({ isOpen, onClose, markers, hotelCoords, dayDate }) => {
  if (!isOpen) return null;

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-container">
        <div className="map-modal-header">
          <h3>{dayDate ? `Itinéraire du ${dayDate}` : 'Aperçu de l\'itinéraire'}</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="map-modal-body">
          <LeafletMapPreview 
            markers={markers || []} 
            hotelPosition={hotelCoords} 
            height="500px" 
          />
        </div>
      </div>

      <style jsx>{`
        .map-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .map-modal-container {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 900px;
          max-height: 90vh;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .map-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .map-modal-header h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .close-button:hover {
          color: #000;
        }
        
        .map-modal-body {
          flex: 1;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MapPreviewModal;