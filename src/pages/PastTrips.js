import React from 'react';
import { trips } from '../data/trips';
import TripCard from '../components/TripCard';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';

const PastTrips = () => {
  return (
    <div className="past-trips-container">
      <h1>Mes Anciens Voyages</h1>
      <div className="trips-list">
        {trips.map(trip => (
          <Link to={`/trip-detail/${trip.id}`} key={trip.id}>
            <TripCard trip={trip} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PastTrips;
