import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import RussieImage from '../assets/images/Russie.png';
import { useQuiz } from '../context/QuizContext';
import { supabase } from '../js/supabaseClient';

// Options existantes
const restrictionsOptions = [
  "Sans lactose",
  "Sans gluten",
  "Végétarien",
  "Végétalien",
  "Halal",
  "Casher",
  "Allergies aux fruits de mer",
  "Allergies aux arachides",
  "Allergies aux fruits à coque",
  "Aucune restriction"
];

const activitesOptions = [
  "Visite de monuments historiques",
  "Découverte de la gastronomie locale",
  "Activités sportives et aventure",
  "Festivals et événements culturels",
  "Détente et bien-être",
  "Shopping et artisanat local",
  "Randonnées et nature",
  "Plages et activités nautiques",
  "Musées et galeries d'art",
  "Vie nocturne et divertissement"
];

const Dropdown = ({ label, placeholder, options, value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{label}</h2>
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-4 py-2 border rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex justify-between items-center"
        >
          <span>{value || placeholder}</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CustomSlider = ({ question, leftLabel, rightLabel, value, onChange }) => {
  const percentage = (value / 10) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{leftLabel}</span>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium">{question}</h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {value.toFixed(1)}/10
          </span>
        </div>
        <span className="text-sm text-gray-500">{rightLabel}</span>
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
        <div
          className="absolute h-full rounded-full"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(to right, #9557fa, #fa9b3d)'
          }}
        ></div>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

function PreferencesQuestions() {
  const navigate = useNavigate();
  const { quizData, updateQuizData } = useQuiz();
  const [preferences, setPreferences] = React.useState({
    journeeType: quizData.day_intensity_preference || 5,
    confortAventure: quizData.comfort_preference || 5
  });

  const handlePreferencesChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
    
    updateQuizData({
      [type === 'journeeType' ? 'day_intensity_preference' : 'comfort_preference']: value
    });
  };

// Dans PreferencesQuestions.js
const handleSubmit = async () => {
  try {
    const finalData = {
      departure_date: quizData.departure_date,
      return_date: quizData.return_date,
      number_of_travelers: quizData.number_of_travelers || 1,
      number_of_rooms: quizData.number_of_rooms || 1,
      destination: quizData.destination || '',
      travel_with: Array.isArray(quizData.travel_with) ? quizData.travel_with : [],
      budget_allocation: quizData.budget_allocation || {
        hebergement: 5,
        transport: 5,
        restaurant: 5,
        activites: 5
      },
      accommodation_preferences: Array.isArray(quizData.accommodation_preferences) 
        ? quizData.accommodation_preferences 
        : [],
      activity_preferences: Array.isArray(quizData.activity_preferences) 
        ? quizData.activity_preferences 
        : [],
      day_intensity_preference: Math.round(preferences.journeeType),
      comfort_preference: Math.round(preferences.confortAventure),
      dietary_restrictions: Array.isArray(quizData.dietary_restrictions) 
        ? quizData.dietary_restrictions 
        : [],
      specific_activities: Array.isArray(quizData.specific_activities) 
        ? quizData.specific_activities 
        : [],
      completion_status: 'completed',
      current_step: 4
    };

    const { data, error } = await supabase
      .from('quiz_responses')
      .insert([finalData])
      .select();

    if (error) throw error;

    navigate('/quiz/confirmation');
  } catch (err) {
    alert(`Une erreur est survenue lors de l'enregistrement: ${err.message}`);
  }
};

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 h-screen p-8 lg:p-12 flex flex-col">
        <Link to="/">
          <img src={Logo} alt="Stella" className="h-8 mb-6" />
        </Link>

        <div className="flex-grow flex flex-col max-h-[calc(100vh-120px)]">
          {/* Sliders */}
          <CustomSlider
            question="Préférez-vous une journée remplie ou plus relaxante ?"
            leftLabel="Relaxante"
            rightLabel="Bien remplie"
            value={preferences.journeeType}
            onChange={(val) => handlePreferencesChange('journeeType', val)}
          />
          <CustomSlider
            question="Préférez-vous le confort ou l'aventure ?"
            leftLabel="Aventurier"
            rightLabel="Confort absolu"
            value={preferences.confortAventure}
            onChange={(val) => handlePreferencesChange('confortAventure', val)}
          />

          <Dropdown
            label="Avez-vous des restrictions alimentaires ?"
            placeholder="Sélectionnez vos restrictions"
            options={restrictionsOptions}
            value={quizData.dietary_restrictions[0] || ''}
            onChange={(value) => updateQuizData({ dietary_restrictions: [value] })}
          />
          
          <Dropdown
            label="Y a-t-il une activité ou un lieu spécifique que vous rêvez d'essayer ou de visiter ?"
            placeholder="Partagez vos envies"
            options={activitesOptions}
            value={quizData.specific_activities[0] || ''}
            onChange={(value) => updateQuizData({ specific_activities: [value] })}
          />

          <div className="mt-auto pt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">3 minutes</span>
              <button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-6 py-2 rounded-full text-sm"
              >
                Terminer
              </button>
            </div>

            <div className="w-full bg-gray-100 h-0.5">
              <div
                className="h-0.5 bg-[#9557fa] rounded-full"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-1/2">
        <img
          src={RussieImage}
          alt="Saint Basile Moscow"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
}

export default PreferencesQuestions;