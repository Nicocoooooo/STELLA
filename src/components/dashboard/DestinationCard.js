import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

const DestinationCard = ({ image, name, isSaved = false, isCreateCard = false }) => {
  if (isCreateCard) {
    return (
      <div className="relative rounded-2xl border-2 border-dashed border-primary/50 h-[200px] flex flex-col items-center justify-center cursor-pointer transition hover:border-primary">
        <div className="text-primary text-5xl mb-2">+</div>
        <p className="text-primary text-sm text-center">Plannifiez votre prochain<br />voyage</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden h-[200px] group">
      {/* Image de fond */}
      <img 
        src={require(`../../assets/images/destinations/${image}`)}
        alt={name}
        className="w-full h-full object-cover"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>

      {/* Bouton like */}
      <button className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm">
        <HeartIcon className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-white'}`} />
      </button>

      {/* Nom de la destination */}
      <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">{name}</h3>
    </div>
  );
};

export default DestinationCard;