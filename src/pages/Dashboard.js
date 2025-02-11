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
    <div className="min-h-screen bg-white">
      {/* Large container with bg-color */}
      <div className="w-full px-24 py-12">
        {/* Content container with max-width */}
        <div className="max-w-[1800px] mx-auto">
          <Header />
          <FilterBar />
          <DestinationGrid destinations={destinations} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;