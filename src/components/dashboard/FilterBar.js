import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = () => {
  const baseSelectClass = "rounded-full bg-white/80 px-8 py-4 text-lg shadow hover:shadow-md transition-shadow font-outfit min-w-[180px] border border-transparent";
  
  return (
    <div className="flex gap-4 mb-12">
      <select className={baseSelectClass}>
        <option>Saison</option>
        <option>Printemps</option>
        <option>Été</option>
        <option>Automne</option>
        <option>Hiver</option>
      </select>

      <select className={baseSelectClass}>
        <option>Où?</option>
        <option>Europe</option>
        <option>Asie</option>
        <option>Amérique du Nord</option>
        <option>Amérique du Sud</option>
        <option>Afrique</option>
        <option>Océanie</option>
      </select>

      <select className={baseSelectClass}>
        <option>Budget</option>
        <option>Économique</option>
        <option>Intermédiaire</option>
        <option>Luxe</option>
      </select>

      <select className={`${baseSelectClass} border-primary/20`}>
        <option>Style de Voyage</option>
        <option>Détente</option>
        <option>Aventure</option>
        <option>Culture</option>
        <option>Sport</option>
      </select>

      <select className={baseSelectClass}>
        <option>Date et Voyageur</option>
      </select>

      <button className="rounded-full bg-gradient-to-r from-primary/90 to-accent text-white px-10 py-4 flex items-center gap-3 shadow hover:shadow-md transition-all text-lg font-outfit">
        <Search className="w-6 h-6" />
        Filtrer
      </button>
    </div>
  );
};

export default FilterBar;