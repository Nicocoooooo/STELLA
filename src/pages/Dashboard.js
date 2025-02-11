import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import Header from '../components/dashboard/Header';
import FilterBar from '../components/dashboard/FilterBar';
import DestinationGrid from '../components/dashboard/DestinationGrid';
import Footer from '../components/dashboard/Footer';

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <div className="flex-grow w-full px-24 py-12">
        {/* Content container with max-width */}
        <div className="max-w-[1800px] mx-auto">
          <Header />
          <FilterBar />
          <DestinationGrid destinations={destinations} />
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