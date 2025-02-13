import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import RussieImage from '../assets/images/Russie.png';


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
    const [isOpen, setIsOpen] = useState(false);
  
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

// Composant pour le slider personnalisé
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
          {/* Barre de fond */}
          <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
          {/* Barre de progression */}
          <div
            className="absolute h-full rounded-full"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(to right, #9557fa, #fa9b3d)'
            }}
          ></div>
          {/* Curseur */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full cursor-pointer"
            style={{
              left: `${percentage}%`,
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #9557fa, #fa9b3d)',
              boxShadow: '0 0 0 2px white'
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
    const [preferences, setPreferences] = useState({
        journeeType: 5, // valeur initiale
        confortAventure: 5 // valeur initiale
      });
  const [restriction, setRestriction] = useState('');
  const [activite, setActivite] = useState('');

  return (
    <div className="min-h-screen flex">
      {/* Colonne de gauche */}
      <div className="w-full lg:w-1/2 h-screen p-8 lg:p-12 flex flex-col">
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="Stella" className="h-8 mb-6" />
        </Link>

        {/* Conteneur principal */}
        <div className="flex-grow flex flex-col max-h-[calc(100vh-120px)]">
          {/* Sliders */}
          <CustomSlider
            question="Préférez-vous une journée remplie ou plus relaxante ?"
            leftLabel="Relaxante"
            rightLabel="Bien remplie"
            value={preferences.journeeType}
            onChange={(val) => setPreferences(prev => ({...prev, journeeType: val}))}
          />
          <CustomSlider
            question="Préférez-vous une journée remplie ou plus relaxante ?"
            leftLabel="Aventurier"
            rightLabel="Confort absolu"
            value={preferences.confortAventure}
            onChange={(val) => setPreferences(prev => ({...prev, confortAventure: val}))}
          />

            <Dropdown
                label="Avez-vous des restrictions alimentaires ?"
                placeholder="Sélectionnez vos restrictions"
                options={restrictionsOptions}
                value={restriction}
                onChange={setRestriction}
                />
                
                <Dropdown
                label="Y a-t-il une activité ou un lieu spécifique que vous rêvez d'essayer ou de visiter ?"
                placeholder="Partagez vos envies"
                options={activitesOptions}
                value={activite}
                onChange={setActivite}
                />

          {/* Footer avec progression */}
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">3 minutes</span>
              <Link 
                to="/quiz/next"
                className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-6 py-2 rounded-full text-sm"
              >
                Suivant
              </Link>
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
          src={RussieImage}
          alt="Saint Basile Moscow"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
}

export default PreferencesQuestions;