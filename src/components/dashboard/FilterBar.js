import React from 'react';

const FilterBar = () => {
  return (
    <div className="flex gap-4 mb-8">
      <select className="rounded-full bg-white px-4 py-2 shadow-sm border border-gray-200">
        <option>Saison</option>
        <option>Printemps</option>
        <option>Été</option>
        <option>Automne</option>
        <option>Hiver</option>
      </select>

      <select className="rounded-full bg-white px-4 py-2 shadow-sm border border-gray-200">
        <option>Où?</option>
        <option>Europe</option>
        <option>Asie</option>
        <option>Amérique du Nord</option>
        <option>Amérique du Sud</option>
        <option>Afrique</option>
        <option>Océanie</option>
      </select>

      <select className="rounded-full bg-white px-4 py-2 shadow-sm border border-gray-200">
        <option>Budget</option>
        <option>Économique</option>
        <option>Intermédiaire</option>
        <option>Luxe</option>
      </select>

      <select className="rounded-full bg-white px-4 py-2 shadow-sm border border-gray-200">
        <option>Style de Voyage</option>
        <option>Détente</option>
        <option>Aventure</option>
        <option>Culture</option>
        <option>Sport</option>
      </select>

      <select className="rounded-full bg-white px-4 py-2 shadow-sm border border-gray-200">
        <option>Date et Voyageur</option>
      </select>

      <button className="rounded-full bg-gradient-to-r from-primary to-accent text-white px-6 py-2">
        Filtrer
      </button>
    </div>
  );
};

export default FilterBar;