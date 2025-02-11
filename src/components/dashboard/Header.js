import React from 'react';
import { Calendar, Heart, Star } from 'lucide-react';
import ProfileMenu from './ProfileMenu';

const Header = ({ userName = '[Prénom]' }) => {
  return (
    <div className="w-full px-6 py-4">
      {/* Logo et profil */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-primary text-3xl font-outfit font-bold">Stella</h1>
        <ProfileMenu />
      </div>

      {/* Message de bienvenue et stats */}
      <div className="mb-8">
        <h2 className="text-accent text-xl font-outfit mb-8">
          Bonjour {userName}
        </h2>
        
        {/* Statistiques */}
        <div className="flex gap-16">
          {/* Voyages réalisés */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-6 h-6 text-primary" />
              <span className="text-2xl font-outfit font-bold">5</span>
            </div>
            <p className="text-sm text-gray-600 font-outfit">Voyages réalisés</p>
          </div>

          {/* Voyages sauvegardés */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-2xl font-outfit font-bold">10</span>
            </div>
            <p className="text-sm text-gray-600 font-outfit">Voyages sauvegardés</p>
          </div>

          {/* Points Stella */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-6 h-6 text-accent" />
              <span className="text-2xl font-outfit font-bold">2500</span>
            </div>
            <p className="text-sm text-gray-600 font-outfit">Points Stella</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;