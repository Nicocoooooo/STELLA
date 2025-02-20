import React from 'react';
import { trips } from '../data/trips'; // Assurez-vous que ce fichier existe avec les données
import TripCard from '../components/TripCard';
import { Link } from 'react-router-dom';

const PastTrips = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="text-purple-500 text-3xl font-bold">
          Stella
        </div>
        <nav className="ml-auto">
          <button className="text-yellow-500 font-semibold">Mon Profil</button>
        </nav>
      </header>

      <main>
        <h1 className="text-purple-500 text-4xl font-bold mb-8">Mes Anciens Voyages</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <Link to={`/trip-detail/${trip.id}`} key={trip.id} className="text-decoration-none">
              <TripCard trip={trip} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PastTrips;
