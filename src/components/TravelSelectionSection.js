import React from 'react';
import MultiDestinationsMap from '../components/MultiDestinationsMap'; // Ajuster le chemin d'importation selon votre structure

const TravelSelectionSection = ({ selectedItems }) => {
  // Extraire les destinations à partir des objets sélectionnés
  const getDestinations = () => {
    // Créer une liste de toutes les destinations à partir des objets sélectionnés
    const allSelectedDestinations = [];
    
    // Ajouter les hôtels
    if (selectedItems.hotels && selectedItems.hotels.length > 0) {
      selectedItems.hotels.forEach(hotel => {
        if (hotel.name && hotel.address) {
          allSelectedDestinations.push({
            name: hotel.name,
            country: hotel.address
          });
        }
      });
    }
    
    // Ajouter les lieux touristiques
    if (selectedItems.lieux && selectedItems.lieux.length > 0) {
      selectedItems.lieux.forEach(lieu => {
        if (lieu.name && lieu.address) {
          allSelectedDestinations.push({
            name: lieu.name,
            country: lieu.address
          });
        }
      });
    }
    
    // Ajouter les activités
    if (selectedItems.activites && selectedItems.activites.length > 0) {
      selectedItems.activites.forEach(activite => {
        if (activite.name && activite.address) {
          allSelectedDestinations.push({
            name: activite.name,
            country: activite.address
          });
        }
      });
    }
    
    // Ajouter les restaurants
    if (selectedItems.restaurants && selectedItems.restaurants.length > 0) {
      selectedItems.restaurants.forEach(restaurant => {
        if (restaurant.name && restaurant.address) {
          allSelectedDestinations.push({
            name: restaurant.name,
            country: restaurant.address
          });
        }
      });
    }
    
    return allSelectedDestinations;
  };
  
  const destinations = getDestinations();
  
  return (
    <div className="bg-white h-full">
      <h3 className="text-2xl font-bold mb-4">Mon Itinéraire</h3>
      
      {destinations.length > 0 ? (
        <MultiDestinationsMap 
          destinations={destinations} 
          title="Points d'intérêt sélectionnés"
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-4">
          <p className="text-gray-500 italic">Ajoutez des lieux à votre voyage pour les voir apparaître sur la carte</p>
        </div>
      )}
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {destinations.length} {destinations.length <= 1 ? 'destination' : 'destinations'} sélectionnée{destinations.length <= 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
};

export default TravelSelectionSection;