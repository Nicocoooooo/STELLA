import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

function TravelPreferences({ userProfile }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [preferences, setPreferences] = useState({
    destinations: [],
    activities: [],
    accommodation: '',
    budget: '',
    travelStyle: [],
  });
  
  // Exemple d'options (à adapter selon ton besoin)
  const destinationOptions = ['Europe', 'Asie', 'Afrique', 'Amérique du Nord'];
  const activityOptions = ['Détente (plages, spas...)', 'Nature et aventures', 'Découverte urbaine', 'Gastronomie et vins', 'Shopping'];
  const accommodationOptions = ['Hôtel', 'Appartement', 'Maison'];
  const budgetOptions = ['Économique', 'Moyen', 'Luxe'];
  const travelStyleOptions = ['Seul', 'En couple', 'En famille', 'Entre amis', 'En famille avec jeunes enfants'];

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        if (!userProfile?.id) return;

        const { data, error } = await supabase
          .from('quiz_responses')
          .select('*')
          .eq('user_id', userProfile.id)
          .single(); // Suppose qu'il n'y a qu'un enregistrement par user

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

  // Gestion des checkboxes (plusieurs choix)
  const handleCheckboxChange = (category, value) => {
    setPreferences(prev => {
      const arr = prev[category] || [];
      const alreadyChecked = arr.includes(value);
      const newArr = alreadyChecked
        ? arr.filter(item => item !== value)
        : [...arr, value];

      return { ...prev, [category]: newArr };
    });
  };

  // Gestion des radios (choix unique)
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
      const { data: existing, error: checkError } = await supabase
        .from('quiz_responses')
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
        updated_at: new Date().toISOString(),
      };

      let supabaseError;
      if (existing) {
        // Mise à jour
        const { error: updateError } = await supabase
          .from('quiz_responses')
          .update(preferencesData)
          .eq('id', existing.id);
        supabaseError = updateError;
      } else {
        // Insertion
        const { error: insertError } = await supabase
          .from('quiz_responses')
          .insert([{
            ...preferencesData,
            created_at: new Date().toISOString(),
          }]);
        supabaseError = insertError;
      }

      if (supabaseError) throw supabaseError;

      setMessage({
        type: 'success',
        text: 'Préférences de voyage mises à jour avec succès !',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erreur lors de la mise à jour des préférences.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#9557fa] mb-6">
        Préférences de voyage
      </h2>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Avec qui voyagez-vous ? */}
        <div>
          <h3 className="text-xl font-semibold text-[#9557fa] mb-4">
            Avec qui voyagez-vous ?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {travelStyleOptions.map(option => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences.travelStyle.includes(option)}
                  onChange={() => handleCheckboxChange('travelStyle', option)}
                  className="form-checkbox w-6 h-6 text-[#9557fa] 
                             border-2 border-[#9557fa] rounded"
                />
                <span className="text-lg text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quel type d'expérience souhaitez-vous ? */}
        <div>
          <h3 className="text-xl font-semibold text-[#9557fa] mb-4">
            Quel type d'expérience souhaitez-vous ?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activityOptions.map(activity => (
              <label
                key={activity}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences.activities.includes(activity)}
                  onChange={() => handleCheckboxChange('activities', activity)}
                  className="form-checkbox w-6 h-6 text-[#9557fa]
                             border-2 border-[#9557fa] rounded"
                />
                <span className="text-lg text-gray-800">{activity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Destination */}
        <div>
          <h3 className="text-xl font-semibold text-[#9557fa] mb-4">
            Vos destinations favorites
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {destinationOptions.map(destination => (
              <label
                key={destination}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences.destinations.includes(destination)}
                  onChange={() => handleCheckboxChange('destinations', destination)}
                  className="form-checkbox w-6 h-6 text-[#9557fa]
                             border-2 border-[#9557fa] rounded"
                />
                <span className="text-lg text-gray-800">{destination}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type d'hébergement */}
        <div>
          <h3 className="text-xl font-semibold text-[#9557fa] mb-4">
            Type d'hébergement préféré
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accommodationOptions.map(option => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="accommodation"
                  value={option}
                  checked={preferences.accommodation === option}
                  onChange={() => handleRadioChange('accommodation', option)}
                  className="form-radio w-6 h-6 text-[#9557fa]
                             border-2 border-[#9557fa] rounded-full"
                />
                <span className="text-lg text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <h3 className="text-xl font-semibold text-[#9557fa] mb-4">
            Budget
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgetOptions.map(option => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="budget"
                  value={option}
                  checked={preferences.budget === option}
                  onChange={() => handleRadioChange('budget', option)}
                  className="form-radio w-6 h-6 text-[#9557fa]
                             border-2 border-[#9557fa] rounded-full"
                />
                <span className="text-lg text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bouton de soumission */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-lg
                       bg-gradient-to-r from-[#9557fa] to-[#fa9b3d]
                       hover:opacity-90 disabled:opacity-70"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer mes préférences'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TravelPreferences;
