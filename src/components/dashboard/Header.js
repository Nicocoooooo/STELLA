import React from 'react';
import { Calendar, Heart, Star } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import { Link } from 'react-router-dom';

const Header = ({ userName, tripsCount, savedTripsCount, points, loading }) => {
  return (
    <div className="w-full py-4 md:py-6">
      {/* Logo et profil */}
      <div className="flex justify-between items-center mb-4">
        <Link to="/">
          <img src={require('../../assets/images/Logo.png')} alt="Stella" className="h-8 md:h-12" />
        </Link>
        <ProfileMenu />
      </div>

      {/* Message de bienvenue et stats */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-accent text-xl md:text-2xl font-outfit mb-3 md:mb-5 text-left">
          Bonjour <span className="font-bold text-primary">{loading ? '...' : userName}</span>
        </h2>
        
        {/* Statistiques - Toujours en ligne */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-outfit font-bold leading-tight">{loading ? '...' : tripsCount}</span>
              <span className="text-xs md:text-sm text-gray-600 font-outfit">Voyages réalisés</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-outfit font-bold leading-tight">{loading ? '...' : savedTripsCount}</span>
              <span className="text-xs md:text-sm text-gray-600 font-outfit">Voyages sauvegardés</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-outfit font-bold leading-tight">{loading ? '...' : points}</span>
              <span className="text-xs md:text-sm text-gray-600 font-outfit">Points Stella</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;