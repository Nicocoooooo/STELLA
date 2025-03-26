import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabaseClient';

//import Logo from '../../assets/images/Logo.png'; // Ajuste si besoin

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

  // Exemple d’options
  //day intensity
  //comfort preference
  //dietary restrictions
  //specific activites
  //
  const travelWithOptions = [
    { id: 'seul', label: 'Seul(e)' },
    { id: 'couple', label: 'En couple' },
    { id: 'famille', label: 'En famille' },
    { id: 'famille-enfants', label: 'En famille (jeunes enfants)' },
    { id: 'amis', label: 'Entre amis' },
  ];
  const activityOptions = [
    { id: 'detente', label: 'Détente (plages, spas...)' },
    { id: 'nature', label: 'Nature et aventures' },
    { id: 'culture', label: 'Découverte urbaine' },
    { id: 'gastronomie', label: 'Gastronomie et vins' },
    { id: 'shopping', label: 'Shopping' },
  ];
  const accommodationOptions = [
    { id: 'hotel', label: 'Hôtel' },
    { id: 'appartement', label: 'Appartement' },
    { id: 'auberge', label: 'Auberge de jeunesse' },
  ];
  

  useEffect(() => {
    if (!userProfile?.id) return;

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_responses')
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
      } catch (err) {
        console.error('Erreur chargement préférences:', err);
      }
    };

    loadPreferences();
  }, [userProfile.id]);

  // Gère les checkboxes (plusieurs choix)
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

  // Gère les radios (choix unique)
  const handleRadioChange = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Vérifier s'il existe déjà un enregistrement
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
        // Mettre à jour
        const { error: updateError } = await supabase
          .from('quiz_responses')
          .update(preferencesData)
          .eq('id', existing.id);
        supabaseError = updateError;
      } else {
        // Insérer
        const { error: insertError } = await supabase
          .from('quiz_responses')
          .insert([{
            ...preferencesData,
            created_at: new Date().toISOString(),
          }]);
        supabaseError = insertError;
      }

      if (supabaseError) throw supabaseError;

      setMessage({ type: 'success', text: 'Préférences enregistrées avec succès !' });
    } catch (err) {
      console.error('Erreur:', err);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des préférences.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    

      
      <div className="flex-grow max-w-2xl mx-auto w-full bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-medium mb-4">
          Personnalisez vos préférences de voyage
        </h2>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded border ${
              message.type === 'success'
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-red-100 border-red-400 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Destinations */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2"></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/*destinationOptions.map(dest => (
              <label key={dest.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.destinations.includes(dest.id)}
                  onChange={() => handleCheckboxChange('destinations', dest.id)}
                  className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded checked:bg-[#9557fa]"
                />
                <span className="text-sm text-gray-700">{dest.label}</span>
              </label>
            ))*/}
          </div>
        </div>

        {/* Avec qui voyagez-vous ? */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Avec qui voyagez-vous ?</h3>
          <div className="grid grid-cols-2 gap-2">
            {travelWithOptions.map(option => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.travelStyle.includes(option.id)}
                  onChange={() => handleCheckboxChange('travelStyle', option.id)}
                  className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded checked:bg-[#9557fa]"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Activités préférées */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Activités préférées</h3>
          <div className="flex flex-col gap-2">
            {activityOptions.map(act => (
              <label key={act.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.activities.includes(act.id)}
                  onChange={() => handleCheckboxChange('activities', act.id)}
                  className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded checked:bg-[#9557fa]"
                />
                <span className="text-sm text-gray-700">{act.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type d'hébergement */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Type d'hébergement préféré</h3>
          <div className="flex flex-col gap-2">
            {accommodationOptions.map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="accommodation"
                  value={opt.id}
                  checked={preferences.accommodation === opt.id}
                  onChange={() => handleRadioChange('accommodation', opt.id)}
                  className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded-full checked:bg-[#9557fa]"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2"></h3>
          <div className="flex flex-col gap-2">
            {/*budgetOptions.map(opt => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="budget"
                  value={opt.id}
                  checked={preferences.budget === opt.id}
                  onChange={() => handleRadioChange('budget', opt.id)}
                  className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded-full checked:bg-[#9557fa]"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))*/}
          </div>
        </div>

        {/* Bouton d'enregistrement */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-6 py-2 rounded-full text-sm
                     hover:opacity-90 disabled:opacity-70"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    
  );
}

export default TravelPreferences;
