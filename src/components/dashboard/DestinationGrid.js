import React from 'react';
import DestinationCard from './DestinationCard';
import { Search } from 'lucide-react';

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
      <div className="grid grid-cols-3 gap-8 w-full mb-12">
        <DestinationCard isCreateCard={true} />
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            image={destination.image}
            name={destination.name}
          />
        ))}
      </div>
      
      <button className="px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-outfit text-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
        Voir plus
      </button>
    </div>
  );
};

export default DestinationGrid;