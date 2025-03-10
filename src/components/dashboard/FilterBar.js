import React, { useState } from 'react';
import { Search, Sun, Sunset, Snowflake, Globe, MapPin, DollarSign, Map, Users } from 'lucide-react';

const FilterBar = ({ activeFilters, onFilterChange }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const baseButtonClass = "rounded-full bg-white/80 px-8 py-4 text-lg shadow hover:shadow-md transition-all font-outfit min-w-[180px] flex items-center gap-2 relative";
  const activeButtonClass = "rounded-full bg-white px-8 py-4 text-lg shadow-md hover:shadow-md transition-all font-outfit min-w-[180px] flex items-center gap-2 relative text-primary";

  const closeMenus = () => setActiveMenu(null);

  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };
  
  // Configurations des filtres
  const seasons = [
    { id: 'spring', icon: <Sun className="w-5 h-5 text-primary" />, text: "Printemps" },
    { id: 'summer', icon: <Sun className="w-5 h-5 text-accent" />, text: "Été" },
    { id: 'autumn', icon: <Sunset className="w-5 h-5 text-accent" />, text: "Automne" },
    { id: 'winter', icon: <Snowflake className="w-5 h-5 text-primary" />, text: "Hiver" }
  ];

  const locations = [
    { id: 'flexible', icon: <Globe className="w-5 h-5 text-primary" />, text: "Je suis flexible" },
    { id: 'asia', icon: <MapPin className="w-5 h-5 text-primary" />, text: "Asie" },
    { id: 'europe', icon: <MapPin className="w-5 h-5 text-primary" />, text: "Europe" },
    { id: 'africa', icon: <MapPin className="w-5 h-5 text-primary" />, text: "Afrique" },
    { id: 'south-america', icon: <MapPin className="w-5 h-5 text-primary" />, text: "Amérique du S" },
    { id: 'north-america', icon: <MapPin className="w-5 h-5 text-primary" />, text: "Amérique du N" },
    { id: 'oceania', icon: <MapPin className="w-5 h-5 text-primary" />, text: "Océanie" }
  ];

  const budgets = [
    { id: 'economic', icon: <DollarSign className="w-5 h-5 text-primary" />, text: "Économique" },
    { id: 'medium', icon: <DollarSign className="w-5 h-5 text-primary" />, text: "Intermédiaire" },
    { id: 'luxury', icon: <DollarSign className="w-5 h-5 text-primary" />, text: "Luxe" }
  ];

  const travelStyles = [
    { id: 'relax', icon: <Sun className="w-5 h-5 text-primary" />, text: "Détente" },
    { id: 'adventure', icon: <Map className="w-5 h-5 text-primary" />, text: "Aventure" },
    { id: 'culture', icon: <Globe className="w-5 h-5 text-primary" />, text: "Culture" },
    { id: 'creative', icon: <Sun className="w-5 h-5 text-primary" />, text: "Créatif" },
    { id: 'city', icon: <MapPin className="w-5 h-5 text-primary" />, text: "City Break" },
    { id: 'sport', icon: <Map className="w-5 h-5 text-primary" />, text: "Sport" }
  ];

  const dateOptions = [
    { id: 'one', icon: <Users className="w-5 h-5 text-primary" />, text: "1 voyageur" },
    { id: 'two', icon: <Users className="w-5 h-5 text-primary" />, text: "2 voyageurs" },
    { id: 'three', icon: <Users className="w-5 h-5 text-primary" />, text: "3 voyageurs" },
    { id: 'four-plus', icon: <Users className="w-5 h-5 text-primary" />, text: "4+ voyageurs" }
  ];

  // Déterminer quel filtre est actif pour l'affichage des boutons
  const getButtonLabel = (filterType, items) => {
    if (!activeFilters[filterType]) {
      switch (filterType) {
        case 'season': return 'Saison';
        case 'location': return 'Où?';
        case 'budget': return 'Budget';
        case 'style': return 'Style de Voyage';
        case 'date': return 'Date et Voyageur';
        default: return '';
      }
    }
    
    const selectedItem = items.find(item => item.id === activeFilters[filterType]);
    return selectedItem ? selectedItem.text : '';
  };

  // Obtenir l'icône pour un filtre actif
  const getButtonIcon = (filterType, items) => {
    if (!activeFilters[filterType]) {
      switch (filterType) {
        case 'season': return <Sun className="w-5 h-5 text-primary" />;
        case 'location': return <Globe className="w-5 h-5 text-primary" />;
        case 'budget': return <DollarSign className="w-5 h-5 text-primary" />;
        case 'style': return <Map className="w-5 h-5 text-primary" />;
        case 'date': return <Users className="w-5 h-5 text-primary" />;
        default: return null;
      }
    }
    
    const selectedItem = items.find(item => item.id === activeFilters[filterType]);
    return selectedItem ? selectedItem.icon : null;
  };

  // Gérer la sélection d'un filtre
  const handleFilterSelect = (filterType, value) => {
    // Si le même filtre est sélectionné à nouveau, on le désactive
    if (activeFilters[filterType] === value) {
      onFilterChange(filterType, null);
    } else {
      onFilterChange(filterType, value);
    }
    closeMenus();
  };

  const renderMenu = (filterType, items) => (
    <div className="absolute top-full mt-2 bg-white rounded-2xl shadow-lg p-2 z-50 w-full">
      {items.map((item) => (
        <button 
          key={item.id} 
          className={`flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded-xl ${activeFilters[filterType] === item.id ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => handleFilterSelect(filterType, item.id)}
        >
          {item.icon}
          <span>{item.text}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex gap-4 mb-12 items-center w-full overflow-visible">
      {/* Saison */}
      <div className="relative flex-1">
        <button 
          className={activeFilters.season || activeMenu === 'season' ? activeButtonClass : baseButtonClass}
          onClick={() => toggleMenu('season')}
        >
          {getButtonIcon('season', seasons)}
          {getButtonLabel('season', seasons)}
        </button>
        {activeMenu === 'season' && renderMenu('season', seasons)}
      </div>

      {/* Location */}
      <div className="relative flex-1">
        <button 
          className={activeFilters.location || activeMenu === 'location' ? activeButtonClass : baseButtonClass}
          onClick={() => toggleMenu('location')}
        >
          {getButtonIcon('location', locations)}
          {getButtonLabel('location', locations)}
        </button>
        {activeMenu === 'location' && renderMenu('location', locations)}
      </div>

      {/* Budget */}
      <div className="relative flex-1">
        <button 
          className={activeFilters.budget || activeMenu === 'budget' ? activeButtonClass : baseButtonClass}
          onClick={() => toggleMenu('budget')}
        >
          {getButtonIcon('budget', budgets)}
          {getButtonLabel('budget', budgets)}
        </button>
        {activeMenu === 'budget' && renderMenu('budget', budgets)}
      </div>

      {/* Style de Voyage */}
      <div className="relative flex-1">
        <button 
          className={activeFilters.style || activeMenu === 'style' ? activeButtonClass : baseButtonClass}
          onClick={() => toggleMenu('style')}
        >
          {getButtonIcon('style', travelStyles)}
          {getButtonLabel('style', travelStyles)}
        </button>
        {activeMenu === 'style' && renderMenu('style', travelStyles)}
      </div>

      {/* Date et Voyageur */}
      <div className="relative flex-1">
        <button 
          className={activeFilters.date || activeMenu === 'date' ? activeButtonClass : baseButtonClass}
          onClick={() => toggleMenu('date')}
        >
          {getButtonIcon('date', dateOptions)}
          {getButtonLabel('date', dateOptions)}
        </button>
        {activeMenu === 'date' && renderMenu('date', dateOptions)}
      </div>

      {/* Bouton Filtrer */}
      <div className="flex-1">
        <button className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-white px-10 py-4 flex items-center justify-center gap-3 shadow hover:shadow-md transition-all text-lg font-outfit">
          <Search className="w-6 h-6" />
          Filtrer
        </button>
      </div>
    </div>
  );
};

export default FilterBar;