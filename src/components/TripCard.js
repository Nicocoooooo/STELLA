import React from 'react';

const TripCard = ({ trip }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <img
        src={trip.imageUrl}
        alt={trip.destination}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{trip.destination}</h2>
        <p className="text-gray-600">{trip.startDate} - {trip.endDate}</p>
      </div>
    </div>
  );
};

export default TripCard;
