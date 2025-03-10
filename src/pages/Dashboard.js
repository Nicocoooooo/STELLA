import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import Header from '../components/dashboard/Header';
import FilterBar from '../components/dashboard/FilterBar';
import DestinationGrid from '../components/dashboard/DestinationGrid';
import Footer from '../components/dashboard/Footer';

const Dashboard = () => {
  const [destinations, setDestinations] = useState([]);
  const [userData, setUserData] = useState({
    firstName: '[Prénom]',
    tripsCount: 0,
    savedTripsCount: 10,
    points: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    season: null,
    location: null,
    budget: null,
    style: null,
    date: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'ID de l'utilisateur connecté
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('Aucun utilisateur connecté');
          setLoading(false);
          return;
        }

        // Récupérer les informations de l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('first_name')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Erreur lors de la récupération des données utilisateur:', userError);
        }

        // Compter le nombre de voyages réalisés (status = 'completed')
        const { data: trips, error: tripsError } = await supabase
          .from('trips')
          .select('id, status')
          .eq('user_id', userId)
          .eq('status', 'completed');

        if (tripsError) {
          console.error('Erreur lors du comptage des voyages:', tripsError);
        }

        // Calculer les points - 175 points par voyage réalisé
        const tripsCount = trips?.length || 0;
        const points = tripsCount * 175;

        // Mettre à jour les données de l'utilisateur
        setUserData({
          firstName: userData?.first_name || '[Prénom]',
          tripsCount: tripsCount,
          savedTripsCount: 10, // Valeur par défaut pour l'instant
          points: points
        });

        // Récupérer les destinations
        const { data: destinationsData, error: destinationsError } = await supabase
          .from('destinations')
          .select('*');
        
        if (destinationsError) {
          console.error('Erreur lors de la récupération des destinations:', destinationsError);
        } else {
          setDestinations(destinationsData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gestion des filtres appliqués
  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <div className="flex-grow w-full px-24 py-12">
        {/* Content container with max-width */}
        <div className="max-w-[1800px] mx-auto">
          <Header 
            userName={userData.firstName}
            tripsCount={userData.tripsCount}
            savedTripsCount={userData.savedTripsCount}
            points={userData.points}
            loading={loading}
          />
          <FilterBar 
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
          <DestinationGrid 
            activeFilters={activeFilters}
          />
        </div>
      </div>

      {/* Footer with the same width constraints */}
      <div className="w-full px-24">
        <div className="max-w-[1800px] mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;