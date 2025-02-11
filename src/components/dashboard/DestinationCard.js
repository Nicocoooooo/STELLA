import React from 'react';
import { Heart, Plus } from 'lucide-react';

const DestinationCard = ({ image, name, isSaved = false, isCreateCard = false }) => {
  if (isCreateCard) {
    return (
      <div className="relative rounded-[32px] border-2 border-dashed border-accent/20 h-[280px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-accent/40 hover:shadow-lg group bg-white/50">
        <div className="w-14 h-14 rounded-full border border-accent/30 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent/5">
          <Plus className="w-7 h-7 text-accent" />
        </div>
        <p className="text-accent/80 text-lg text-center font-outfit">
          Plannifiez votre prochain<br />voyage
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-[32px] overflow-hidden h-[280px] group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Image de fond */}
      <img 
        src={require(`../../assets/images/destinations/${image}`)}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/70"></div>

      {/* Bouton like */}
      <button className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 backdrop-blur-[2px] transition-all duration-300 hover:bg-white/20 hover:scale-105">
        <Heart 
          className={`w-5 h-5 transition-colors duration-300 ${
            isSaved ? 'fill-red-500 text-red-500' : 'text-white hover:fill-red-500/50'
          }`} 
        />
      </button>

      {/* Nom de la destination */}
      <h3 className="absolute bottom-6 left-6 text-white text-2xl font-medium font-outfit tracking-wide">{name}</h3>
    </div>
  );
};

export default DestinationCard;