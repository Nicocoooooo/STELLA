import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = () => {
  const selectClassName = "rounded-full bg-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow font-outfit min-w-[180px]";
  
  return (
    <div className="flex gap-4 mb-12">
      <select className={selectClassName}>
        <option>Saison</option>
        <option>Printemps</option>
        <option>Été</option>
        <option>Automne</option>
        <option>Hiver</option>
      </select>

      <select className={selectClassName}>
        <option>Où?</option>
        <option>Europe</option>
        <option>Asie</option>
        <option>Amérique du Nord</option>
        <option>Amérique du Sud</option>
        <option>Afrique</option>
        <option>Océanie</option>
      </select>

      <select className={selectClassName}>
        <option>Budget</option>
        <option>Économique</option>
        <option>Intermédiaire</option>
        <option>Luxe</option>
      </select>

      <select className={selectClassName}>
        <option>Style de Voyage</option>
        <option>Détente</option>
        <option>Aventure</option>
        <option>Culture</option>
        <option>Sport</option>
      </select>

      <select className={selectClassName}>
        <option>Date et Voyageur</option>
      </select>

      <button className="rounded-full bg-gradient-to-r from-primary to-accent text-white px-8 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all text-lg font-outfit">
        <Search className="w-6 h-6" />
        Filtrer
      </button>
    </div>
  );
};

export default FilterBar;