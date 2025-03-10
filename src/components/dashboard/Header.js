import React from 'react';
import { Calendar, Heart, Star } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import { Link } from 'react-router-dom';

const Header = ({ userName, tripsCount, savedTripsCount, points, loading }) => {
  return (
    <div className="w-full">
      {/* Logo et profil */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-12">
        <Link to="/">
          <img src={require('../../assets/images/Logo.png')} alt="Stella" className="h-10 sm:h-12 md:h-16" />
        </Link>
        <ProfileMenu />
      </div>

      {/* Message de bienvenue et stats */}
      <div className="mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-accent text-xl sm:text-2xl md:text-3xl font-outfit mb-6 sm:mb-8 md:mb-12 text-center md:text-left">
          Bonjour <span className="font-bold text-primary">{loading ? '...' : userName}</span>
        </h2>
        
        {/* Statistiques */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 sm:gap-0 px-0 sm:px-6 md:px-12">
          <div className="flex flex-col items-center">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
            <span className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold mt-2 sm:mt-3 md:mt-4">{loading ? '...' : tripsCount}</span>
            <span className="text-sm sm:text-base text-gray-600 font-outfit mt-1">Voyages réalisés</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
            <span className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold mt-2 sm:mt-3 md:mt-4">{loading ? '...' : savedTripsCount}</span>
            <span className="text-sm sm:text-base text-gray-600 font-outfit mt-1">Voyages sauvegardés</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent" />
            <span className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold mt-2 sm:mt-3 md:mt-4">{loading ? '...' : points}</span>
            <span className="text-sm sm:text-base text-gray-600 font-outfit mt-1">Points Stella</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;