import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import DubaiImage from '../assets/images/Dubai.png';
import { useQuiz } from '../context/QuizContext';

// Composant pour les sliders de budget
const BudgetSlider = ({ label, value, onChange, leftLabel, rightLabel }) => {
  const percentage = (value / 10) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{leftLabel}</span>
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">{label}</span>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {value.toFixed(1)}/10
          </span>
        </div>
        <span className="text-sm text-gray-500">{rightLabel}</span>
      </div>
      
      <div className="relative h-2">
        <div className="absolute inset-0 bg-gray-100 rounded-full" />
        <div
          className="absolute h-full rounded-full"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(to right, #9557fa, #fa9b3d)'
          }}
        />
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

const CheckboxOption = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded checked:bg-[#9557fa]"
        />
        {checked && (
          <svg className="absolute top-0.5 left-0.5 w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};

function BudgetQuestions() {
  const navigate = useNavigate();
  const { quizData, updateQuizData } = useQuiz();

  const handleBudgetChange = (type, value) => {
    updateQuizData({
      budget_allocation: {
        ...quizData.budget_allocation,
        [type]: value
      }
    });
  };

  const handleAccommodationChange = (type) => {
    const newAccommodations = quizData.accommodation_preferences.includes(type)
      ? quizData.accommodation_preferences.filter(item => item !== type)
      : [...quizData.accommodation_preferences, type];

    updateQuizData({
      accommodation_preferences: newAccommodations
    });
  };

  const handleNext = () => {
    updateQuizData({
      current_step: 3,
      completion_status: 'in_progress'
    });
    navigate('/quiz/preferences');
  };

  return (
    <div className="min-h-screen flex">
      {/* Colonne de gauche */}
      <div className="w-full lg:w-1/2 h-screen p-8 lg:p-12 flex flex-col">
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="Stella" className="h-8 mb-6" />
        </Link>

        {/* Conteneur principal avec limitation de hauteur */}
        <div className="flex-grow flex flex-col max-h-[calc(100vh-120px)]">
          <h2 className="text-2xl font-bold mb-6">Comment voulez-vous répartir votre budget ?</h2>

          {/* Sliders de budget */}
          <BudgetSlider
            label="Hébergement"
            value={quizData.budget_allocation.hebergement}
            onChange={(val) => handleBudgetChange('hebergement', val)}
            leftLabel="Simple et fonctionnel"
            rightLabel="Luxe et prestige"
          />
          <BudgetSlider
            label="Transport"
            value={quizData.budget_allocation.transport}
            onChange={(val) => handleBudgetChange('transport', val)}
            leftLabel="Transport local"
            rightLabel="Véhicule personnel"
          />
          <BudgetSlider
            label="Restaurant"
            value={quizData.budget_allocation.restaurant}
            onChange={(val) => handleBudgetChange('restaurant', val)}
            leftLabel="Street food & Marché"
            rightLabel="Gastronomie"
          />
          <BudgetSlider
            label="Activités"
            value={quizData.budget_allocation.activites}
            onChange={(val) => handleBudgetChange('activites', val)}
            leftLabel="Visites gratuites"
            rightLabel="Expériences exclusives"
          />

          {/* Types d'hébergement */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Quel type d'hébergement recherchez-vous ?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Hôtels',
                'Bateaux ou Croisières',
                'Locations',
                'Chez l\'habitant',
                'Campings'
              ].map((option) => (
                <CheckboxOption
                  key={option}
                  label={option}
                  checked={quizData.accommodation_preferences.includes(option)}
                  onChange={() => handleAccommodationChange(option)}
                />
              ))}
            </div>
          </div>

          {/* Footer avec progression */}
          <div className="mt-auto pt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">3 minutes</span>
              <button 
                onClick={handleNext}
                className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-6 py-2 rounded-full text-sm"
              >
                Suivant
              </button>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-gray-100 h-0.5">
              <div
                className="h-0.5 bg-[#9557fa] rounded-full"
                style={{ width: '50%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Colonne de droite - Image */}
      <div className="hidden lg:block w-1/2">
        <img
          src={DubaiImage}
          alt="Dubai"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
}

export default BudgetQuestions;