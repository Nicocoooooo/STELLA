import React from 'react';
import MapPlaceholderImg from '../assets/images/Placeholder_Map.png'; // Assurez-vous d'avoir cette image dans le dossier

function TravelMap() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-[#9557fa] mb-4">Itinéraire</h3>
      
      <div className="rounded-lg overflow-hidden">
        <img 
          src={MapPlaceholderImg} 
          alt="Carte du pays" 
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

export default TravelMap;