import React from 'react';
import DestinationCard from './DestinationCard';

const DestinationGrid = () => {
  const destinations = [
    { id: 1, image: "Hawai.webp", name: "Hawaii" },
    { id: 2, image: "Perou.png", name: "Pérou" },
    { id: 3, image: "Alaska.png", name: "Alaska" },
    { id: 4, image: "Chine.png", name: "Chine" },
    { id: 5, image: "Dubai.jpg", name: "Dubai" },
    { id: 6, image: "Singapour.png", name: "Singapour" },
    { id: 7, image: "Canada.png", name: "Canada" },
    { id: 8, image: "Thailand.png", name: "Thaïlande" }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 gap-8 w-full mb-8">
        <DestinationCard isCreateCard={true} />
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            image={destination.image}
            name={destination.name}
          />
        ))}
      </div>
      
      <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-outfit text-lg shadow-md hover:shadow-lg transition-shadow">
        Voir plus
      </button>
    </div>
  );
};

export default DestinationGrid;