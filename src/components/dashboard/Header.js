import React from 'react';
import { Calendar, Heart, Star } from 'lucide-react';
import ProfileMenu from './ProfileMenu';

const Header = ({ userName, tripsCount, savedTripsCount, points, loading }) => {
  return (
    <div className="w-full">
      {/* Logo et profil */}
      <div className="flex justify-between items-center mb-12">
        <img src={require('../../assets/images/Logo.png')} alt="Stella" className="h-16" />
        <ProfileMenu />
      </div>

      {/* Message de bienvenue et stats */}
      <div className="mb-16">
        <h2 className="text-accent text-3xl font-outfit mb-12">
          Bonjour <span className="font-bold text-primary">{loading ? '...' : userName}</span>
        </h2>
        
        {/* Statistiques */}
        <div className="flex justify-between px-12">
          <div className="flex flex-col items-center">
            <Calendar className="w-12 h-12 text-primary" />
            <span className="text-5xl font-outfit font-bold mt-4">{loading ? '...' : tripsCount}</span>
            <span className="text-base text-gray-600 font-outfit mt-1">Voyages réalisés</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Heart className="w-12 h-12 text-primary" />
            <span className="text-5xl font-outfit font-bold mt-4">{loading ? '...' : savedTripsCount}</span>
            <span className="text-base text-gray-600 font-outfit mt-1">Voyages sauvegardés</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Star className="w-12 h-12 text-accent" />
            <span className="text-5xl font-outfit font-bold mt-4">{loading ? '...' : points}</span>
            <span className="text-base text-gray-600 font-outfit mt-1">Points Stella</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;