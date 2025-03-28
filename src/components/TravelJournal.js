import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

const TravelJournal = () => {
  const { id } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);

  // Styles pour la scrollbar personnalisée
  const scrollbarStyles = `
    ::-webkit-scrollbar {
      width: 4px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(180, 180, 180, 0.4);
      border-radius: 20px;
    }
  `;

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('trip_id', id)
          .order('entry_date', { ascending: true });
        
        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération du journal:', error);
        setError("Impossible de charger les entrées du journal.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJournalEntries();
    }
  }, [id]);

  const filteredEntries = activeTab === 'all' 
    ? entries 
    : entries.filter(entry => entry.type === activeTab);

  // Fonction pour rendre les étoiles de notation
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Fonction pour obtenir l'icône selon le type d'entrée
  const getIcon = (type) => {
    switch (type) {
      case 'hotel':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'restaurant':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
          </svg>
        );
      case 'activity':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'transport':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <style>{scrollbarStyles}</style>
      <div className="p-4">
        <h2 className="text-xl text-primary font-bold mb-4">Mon carnet de voyage</h2>
        
        {/* Filtres */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            Tous
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'hotel' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('hotel')}
          >
            Hôtels
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'restaurant' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('restaurant')}
          >
            Restaurants
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'activity' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('activity')}
          >
            Activités
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'transport' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('transport')}
          >
            Transports
          </button>
        </div>

        {/* Liste des entrées */}
        <div className="overflow-y-auto pr-1" style={{ maxHeight: '400px' }}>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredEntries.length > 0 ? (
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full mt-1">
                      {getIcon(entry.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{entry.name}</h3>
                        <span className="text-xs text-gray-500">{formatDate(entry.entry_date)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{entry.location}</p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-3">{entry.description}</p>
                      <div className="mt-1 flex">
                        {renderStars(entry.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune entrée dans le journal pour ce voyage.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelJournal;