import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import Header from '../components/dashboard/Header';
import FilterBar from '../components/dashboard/FilterBar';
import DestinationGrid from '../components/dashboard/DestinationGrid';

const Dashboard = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*');
      
      if (error) {
        console.error('Error fetching destinations:', error);
      } else {
        setDestinations(data);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Header />
      <FilterBar />
      <DestinationGrid destinations={destinations} />
    </div>
  );
};

export default Dashboard;