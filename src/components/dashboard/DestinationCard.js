import React from 'react';
import { Heart, Plus } from 'lucide-react';

const DestinationCard = ({ image, name, isSaved = false, isCreateCard = false }) => {
  if (isCreateCard) {
    return (
      <div className="relative rounded-[32px] border-2 border-dashed border-accent/30 h-[280px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-lg group">
        <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent/5">
          <Plus className="w-8 h-8 text-accent" />
        </div>
        <p className="text-accent text-lg text-center font-outfit">
          Plannifiez votre prochain<br />voyage
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-[32px] overflow-hidden h-[280px] group shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Image de fond */}
      <img 
        src={require(`../../assets/images/destinations/${image}`)}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60"></div>

      {/* Bouton like */}
      <button className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-110">
        <Heart 
          className={`w-6 h-6 transition-colors duration-300 ${
            isSaved ? 'fill-red-500 text-red-500' : 'text-white hover:fill-red-500/50'
          }`} 
        />
      </button>

      {/* Nom de la destination */}
      <h3 className="absolute bottom-6 left-6 text-white text-3xl font-semibold font-outfit">{name}</h3>
    </div>
  );
};

export default DestinationCard;