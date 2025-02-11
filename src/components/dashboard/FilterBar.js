import React, { useState } from 'react';
import { Search, Sun, Sunset, Snowflake, Globe, MapPin, DollarSign, Map, Users, Tent, Book, Camera, Bike, Mountain, Umbrella } from 'lucide-react';

const FilterBar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const baseButtonClass = "rounded-full bg-white/80 px-8 py-4 text-lg shadow hover:shadow-md transition-all font-outfit min-w-[180px] flex items-center gap-2 relative";

  const closeMenus = () => setActiveMenu(null);

  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  const seasonIcons = {
    'Printemps': <Sun className="w-5 h-5 text-primary" />,
    'Été': <Sun className="w-5 h-5 text-accent" />,
    'Automne': <Sunset className="w-5 h-5 text-accent" />,
    'Hiver': <Snowflake className="w-5 h-5 text-primary" />
  };

  const locations = [
    { icon: <Globe className="w-5 h-5" />, text: "Je suis flexible" },
    { icon: <MapPin className="w-5 h-5" />, text: "Asie" },
    { icon: <MapPin className="w-5 h-5" />, text: "Europe" },
    { icon: <MapPin className="w-5 h-5" />, text: "Afrique" },
    { icon: <MapPin className="w-5 h-5" />, text: "Amérique du S" },
    { icon: <MapPin className="w-5 h-5" />, text: "Amérique du N" },
    { icon: <MapPin className="w-5 h-5" />, text: "Océanie" }
  ];

  const budgets = [
    { icon: <DollarSign className="w-5 h-5" />, text: "Économique" },
    { icon: <DollarSign className="w-5 h-5" />, text: "Intermédiaire" },
    { icon: <DollarSign className="w-5 h-5" />, text: "Luxe" }
  ];

  const travelStyles = [
    { icon: <Umbrella className="w-5 h-5" />, text: "Détente" },
    { icon: <Mountain className="w-5 h-5" />, text: "Aventure" },
    { icon: <Book className="w-5 h-5" />, text: "Culture" },
    { icon: <Camera className="w-5 h-5" />, text: "Créatif" },
    { icon: <Tent className="w-5 h-5" />, text: "City Break" },
    { icon: <Bike className="w-5 h-5" />, text: "Sport" }
  ];

  const dateOptions = [
    { icon: <Users className="w-5 h-5" />, text: "1 voyageur" },
    { icon: <Users className="w-5 h-5" />, text: "2 voyageurs" },
    { icon: <Users className="w-5 h-5" />, text: "3 voyageurs" },
    { icon: <Users className="w-5 h-5" />, text: "4+ voyageurs" }
  ];

  const renderMenu = (items) => (
    <div className="absolute top-full mt-2 bg-white rounded-2xl shadow-lg p-2 z-10 w-full">
      {items.map((item, index) => (
        <button 
          key={index} 
          className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded-xl"
          onClick={() => closeMenus()}
        >
          {item.icon}
          {item.text}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex gap-4 mb-12 items-center">
      {/* Saison */}
      <div className="relative">
        <button 
          className={baseButtonClass}
          onClick={() => toggleMenu('season')}
        >
          <Sun className="w-5 h-5 text-primary" />
          Saison
        </button>
        {activeMenu === 'season' && renderMenu(
          Object.entries(seasonIcons).map(([season, icon]) => ({
            icon: icon,
            text: season
          }))
        )}
      </div>

      {/* Location */}
      <div className="relative">
        <button 
          className={baseButtonClass}
          onClick={() => toggleMenu('location')}
        >
          <Globe className="w-5 h-5 text-primary" />
          Où?
        </button>
        {activeMenu === 'location' && renderMenu(locations)}
      </div>

      {/* Budget */}
      <div className="relative">
        <button 
          className={baseButtonClass}
          onClick={() => toggleMenu('budget')}
        >
          <DollarSign className="w-5 h-5 text-primary" />
          Budget
        </button>
        {activeMenu === 'budget' && renderMenu(budgets)}
      </div>

      {/* Style de Voyage */}
      <div className="relative">
        <button 
          className={baseButtonClass}
          onClick={() => toggleMenu('style')}
        >
          <Map className="w-5 h-5 text-primary" />
          Style de Voyage
        </button>
        {activeMenu === 'style' && renderMenu(travelStyles)}
      </div>

      {/* Date et Voyageur */}
      <div className="relative">
        <button 
          className={baseButtonClass}
          onClick={() => toggleMenu('date')}
        >
          <Users className="w-5 h-5 text-primary" />
          Date et Voyageur
        </button>
        {activeMenu === 'date' && renderMenu(dateOptions)}
      </div>

      {/* Bouton Filtrer */}
      <button className="rounded-full bg-gradient-to-r from-primary to-accent text-white px-10 py-4 flex items-center gap-3 shadow hover:shadow-md transition-all text-lg font-outfit">
        <Search className="w-6 h-6" />
        Filtrer
      </button>
    </div>
  );
};

export default FilterBar;