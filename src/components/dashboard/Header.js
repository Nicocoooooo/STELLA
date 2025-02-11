import React from 'react';
import { StarIcon, CalendarIcon, HeartIcon } from '@heroicons/react/24/outline';
import ProfileMenu from './ProfileMenu';

const Header = ({ userName = '[Prénom]' }) => {
  return (
    <div className="w-full">
      {/* Logo et profil */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-primary text-2xl font-bold">Stella</h1>
        <ProfileMenu />
      </div>

      {/* Message de bienvenue et stats */}
      <div className="mb-8">
        <h2 className="text-accent text-xl mb-6">Bonjour {userName}</h2>
        
        {/* Statistiques */}
        <div className="flex gap-4">
          {/* Voyages réalisés */}
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold">5</span>
            </div>
            <p className="text-sm text-gray-600">Voyage réalisés</p>
          </div>

          {/* Voyages sauvegardés */}
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <HeartIcon className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold">10</span>
            </div>
            <p className="text-sm text-gray-600">Voyage sauvegardés</p>
          </div>

          {/* Points Stella */}
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <StarIcon className="w-6 h-6 text-accent" />
              <span className="text-2xl font-bold">2500</span>
            </div>
            <p className="text-sm text-gray-600">Points Stella</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;