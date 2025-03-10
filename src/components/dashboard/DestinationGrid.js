import React from 'react';
import DestinationCard from './DestinationCard';

const DestinationGrid = ({ activeFilters }) => {
  // Données des destinations avec attributs pour le filtrage
  const allDestinations = [
    { 
      id: 1, 
      image: "Hawai.webp", 
      name: "Hawaii", 
      season: ['summer', 'spring'],
      location: 'oceania',
      budget: 'luxury',
      style: ['relax', 'adventure']
    },
    { 
      id: 2, 
      image: "Perou.png", 
      name: "Pérou", 
      season: ['spring', 'autumn'],
      location: 'south-america',
      budget: 'medium',
      style: ['adventure', 'culture']
    },
    { 
      id: 3, 
      image: "Alaska.png", 
      name: "Alaska", 
      season: ['winter'],
      location: 'north-america',
      budget: 'luxury',
      style: ['adventure']
    },
    { 
      id: 4, 
      image: "Chine.png", 
      name: "Chine", 
      season: ['spring', 'autumn'],
      location: 'asia',
      budget: 'medium',
      style: ['culture', 'adventure']
    },
    { 
      id: 5, 
      image: "Dubai.jpg", 
      name: "Dubai", 
      season: ['winter', 'autumn'],
      location: 'asia',
      budget: 'luxury',
      style: ['luxury', 'city']
    },
    { 
      id: 6, 
      image: "Singapour.png", 
      name: "Singapour", 
      season: ['summer', 'spring'],
      location: 'asia',
      budget: 'luxury',
      style: ['city', 'culture']
    },
    { 
      id: 7, 
      image: "Canada.png", 
      name: "Canada", 
      season: ['summer', 'autumn', 'winter'],
      location: 'north-america',
      budget: 'medium',
      style: ['adventure', 'nature']
    },
    { 
      id: 8, 
      image: "Thailand.png", 
      name: "Thaïlande", 
      season: ['winter', 'spring'],
      location: 'asia',
      budget: 'economic',
      style: ['relax', 'culture']
    }
  ];

  // Filtrer les destinations en fonction des filtres actifs
  const filteredDestinations = allDestinations.filter(destination => {
    // Si aucun filtre n'est actif, afficher toutes les destinations
    if (!activeFilters.season && !activeFilters.location && !activeFilters.budget && !activeFilters.style) {
      return true;
    }

    // Filtrer par saison
    if (activeFilters.season && !destination.season.includes(activeFilters.season)) {
      return false;
    }

    // Filtrer par emplacement
    if (activeFilters.location && activeFilters.location !== 'flexible' && destination.location !== activeFilters.location) {
      return false;
    }

    // Filtrer par budget
    if (activeFilters.budget && destination.budget !== activeFilters.budget) {
      return false;
    }

    // Filtrer par style de voyage
    if (activeFilters.style && !destination.style.includes(activeFilters.style)) {
      return false;
    }

    // Si toutes les conditions sont passées, afficher la destination
    return true;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full mb-8 sm:mb-10 lg:mb-12">
        <DestinationCard isCreateCard={true} />
        {filteredDestinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            image={destination.image}
            name={destination.name}
          />
        ))}
      </div>
      
      {filteredDestinations.length > 0 && (
        <button className="px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-outfit text-sm sm:text-base lg:text-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
          Voir plus
        </button>
      )}
      
      {filteredDestinations.length === 0 && (
        <div className="text-center py-8 sm:py-10">
          <h3 className="text-lg sm:text-xl text-gray-600">Aucune destination ne correspond à vos critères</h3>
          <p className="text-gray-500 mt-2">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
};

export default DestinationGrid;