import React from 'react';
import { Heart, Plus } from 'lucide-react';

const DestinationCard = ({ image, name, isSaved = false, isCreateCard = false }) => {
  if (isCreateCard) {
    return (
      <div className="relative rounded-3xl border-2 border-dashed border-primary/30 h-[280px] flex flex-col items-center justify-center cursor-pointer transition hover:border-primary group">
        <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-4 group-hover:bg-primary/5">
          <Plus className="w-8 h-8 text-primary" />
        </div>
        <p className="text-primary text-lg text-center font-outfit">
          Plannifiez votre prochain<br />voyage
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden h-[280px] group shadow-lg">
      {/* Image de fond */}
      <img 
        src={require(`../../assets/images/destinations/${image}`)}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>

      {/* Bouton like */}
      <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">
        <Heart className={`w-6 h-6 ${isSaved ? 'fill-current text-red-500' : 'text-white'}`} />
      </button>

      {/* Nom de la destination */}
      <h3 className="absolute bottom-6 left-6 text-white text-3xl font-semibold font-outfit">{name}</h3>
    </div>
  );
};

export default DestinationCard;