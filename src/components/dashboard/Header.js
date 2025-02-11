import React from 'react';
import { Calendar, Heart, Star } from 'lucide-react';
import ProfileMenu from './ProfileMenu';

const Header = ({ userName = '[Prénom]' }) => {
  const stats = [
    { icon: <Calendar className="w-12 h-12 text-primary" />, value: "5", label: "Voyages réalisés" },
    { icon: <Heart className="w-12 h-12 text-primary" />, value: "10", label: "Voyages sauvegardés" },
    { icon: <Star className="w-12 h-12 text-accent" />, value: "2500", label: "Points Stella" }
  ];

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
          Bonjour {userName}
        </h2>
        
        {/* Statistiques */}
        <div className="flex justify-between px-12">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              {stat.icon}
              <span className="text-5xl font-outfit font-bold mt-4">{stat.value}</span>
              <span className="text-base text-gray-600 font-outfit mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;