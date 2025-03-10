import React from 'react';
import TravelJournalImg from '../assets/images/Placeholder_Journal.png'; // Assurez-vous d'avoir cette image dans le dossier

function TravelJournal() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold text-[#9557fa] mb-4">Mon carnet de voyage</h3>
      
      <div className="rounded-lg overflow-hidden">
        <img 
          src={TravelJournalImg} 
          alt="Carnet de voyage" 
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

export default TravelJournal;