import React from 'react';
import DestinationCard from './DestinationCard';

const DestinationGrid = ({ destinations }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <DestinationCard isCreateCard={true} />
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          image={destination.image_url}
          name={destination.name}
          isSaved={false}
        />
      ))}
    </div>
  );
};

export default DestinationGrid;