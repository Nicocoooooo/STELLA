import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

function TravelPreferences({ userProfile, updateProfile }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [preferences, setPreferences] = useState({
    destinations: [],
    activities: [],
    accommodation: '',
    budget: '',
    travelStyle: [],
  });
  
  // Options pour les préférences
  const destinationOptions = ['Europe', 'Asie', 'Afrique', 'Amérique du Nord', 'Amérique du Sud', 'Océanie', 'Antarctique'];
  const activityOptions = ['Plage', 'Montagne', 'Culture', 'Gastronomie', 'Aventure', 'Shopping', 'Détente'];
  const accommodationOptions = ['Hôtel', 'Appartement', 'Maison', 'Camping', 'Auberge de jeunesse', 'Chez l\'habitant'];
  const budgetOptions = ['Économique', 'Moyen', 'Luxe'];
  const travelStyleOptions = ['Solo', 'En couple', 'En famille', 'Entre amis', 'Voyage d\'affaires'];

  useEffect(() => {
    // Charger les préférences existantes
    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('travel_preferences')
          .select('*')
          .eq('user_id', userProfile.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setPreferences({
            destinations: data.destinations || [],
            activities: data.activities || [],
            accommodation: data.accommodation || '',
            budget: data.budget || '',
            travelStyle: data.travel_style || [],
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
      }
    };

    loadPreferences();
  }, [userProfile.id]);

  const handleCheckboxChange = (category, value) => {
    if (category === 'destinations') {
      setPreferences(prev => ({
        ...prev,
        destinations: prev.destinations.includes(value)
          ? prev.destinations.filter(item => item !== value)
          : [...prev.destinations, value]
      }));
    } else if (category === 'activities') {
      setPreferences(prev => ({
        ...prev,
        activities: prev.activities.includes(value)
          ? prev.activities.filter(item => item !== value)
          : [...prev.activities, value]
      }));
    } else if (category === 'travelStyle') {
      setPreferences(prev => ({
        ...prev,
        travelStyle: prev.travelStyle.includes(value)
          ? prev.travelStyle.filter(item => item !== value)
          : [...prev.travelStyle, value]
      }));
    }
  };

  const handleRadioChange = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Vérifier si les préférences existent déjà
      const { data, error: checkError } = await supabase
        .from('travel_preferences')
        .select('id')
        .eq('user_id', userProfile.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const preferencesData = {
        user_id: userProfile.id,
        destinations: preferences.destinations,
        activities: preferences.activities,
        accommodation: preferences.accommodation,
        budget: preferences.budget,
        travel_style: preferences.travelStyle,
        updated_at: new Date().toISOString()
      };

      let error;
      
      if (data) {
        // Mettre à jour les préférences existantes
        const { error: updateError } = await supabase
          .from('travel_preferences')
          .update(preferencesData)
          .eq('id', data.id);
          
        error = updateError;
      } else {
        // Insérer de nouvelles préférences
        const { error: insertError } = await supabase
          .from('travel_preferences')
          .insert([{
            ...preferencesData,
            created_at: new Date().toISOString()
          }]);
          
        error = insertError;
      }

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Préférences de voyage mises à jour avec succès !' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des préférences.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#9557fa] mb-6">Préférences de voyage</h2>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Destinations préférées */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Destinations préférées</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {destinationOptions.map(destination => (
              <label key={destination} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.destinations.includes(destination)}
                  onChange={() => handleCheckboxChange('destinations', destination)}
                  className="w-5 h-5 accent-[#9557fa]"
                />
                <span>{destination}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Activités préférées */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Activités préférées</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {activityOptions.map(activity => (
              <label key={activity} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.activities.includes(activity)}
                  onChange={() => handleCheckboxChange('activities', activity)}
                  className="w-5 h-5 accent-[#9557fa]"
                />
                <span>{activity}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Type d'hébergement */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Type d'hébergement préféré</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {accommodationOptions.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="accommodation"
                  value={option}
                  checked={preferences.accommodation === option}
                  onChange={() => handleRadioChange('accommodation', option)}
                  className="w-5 h-5 accent-[#9557fa]"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Budget */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Budget</h3>
          <div className="grid grid-cols-3 gap-3">
            {budgetOptions.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="budget"
                  value={option}
                  checked={preferences.budget === option}
                  onChange={() => handleRadioChange('budget', option)}
                  className="w-5 h-5 accent-[#9557fa]"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Style de voyage */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Style de voyage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {travelStyleOptions.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.travelStyle.includes(option)}
                  onChange={() => handleCheckboxChange('travelStyle', option)}
                  className="w-5 h-5 accent-[#9557fa]"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Bouton de soumission */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 mt-6 text-white font-semibold rounded-lg bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] hover:opacity-90 disabled:opacity-70"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer mes préférences'}
        </button>
      </form>
    </div>
  );
}

export default TravelPreferences;