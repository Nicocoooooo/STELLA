import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import VolcanoImage from '../assets/images/Volcano.png';
import DateTravelSelector from '../components/DateTravelSelector';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';


// Liste des destinations
const destinations = [
    { id: 'paris', name: 'Paris, France' },
    { id: 'london', name: 'Londres, Royaume-Uni' },
    { id: 'rome', name: 'Rome, Italie' },
    { id: 'barcelona', name: 'Barcelone, Espagne' },
    { id: 'amsterdam', name: 'Amsterdam, Pays-Bas' },
    { id: 'berlin', name: 'Berlin, Allemagne' },
    { id: 'vienna', name: 'Vienne, Autriche' },
    { id: 'prague', name: 'Prague, République Tchèque' },
    { id: 'tokyo', name: 'Tokyo, Japon' },
    { id: 'kyoto', name: 'Kyoto, Japon' },
    { id: 'bangkok', name: 'Bangkok, Thaïlande' },
    { id: 'singapore', name: 'Singapour, Singapour' },
    { id: 'newyork', name: 'New York, États-Unis' },
    { id: 'sanfrancisco', name: 'San Francisco, États-Unis' },
    { id: 'dubai', name: 'Dubaï, Émirats Arabes Unis' },
    { id: 'sydney', name: 'Sydney, Australie' },
    { id: 'capetown', name: 'Le Cap, Afrique du Sud' },
    { id: 'marrakech', name: 'Marrakech, Maroc' },
    { id: 'rio', name: 'Rio de Janeiro, Brésil' },
    { id: 'manila', name: 'Manila, Philippines' },
    { id: 'istanbul', name: 'Istanbul, Turquie' }
  ];
  
  function Questions() {
    const navigate = useNavigate();
    const { quizData, updateQuizData } = useQuiz();
    const [error, setError] = useState(null);
  
    const handleDateTravelChange = (newDates) => {
      try {
        updateQuizData({
          departure_date: newDates.startDate,
          return_date: newDates.endDate,
          number_of_travelers: newDates.travelers,
          number_of_rooms: newDates.rooms
        });
      } catch (err) {
        setError(err.message);
      }
    };
  
    const handleDestinationChange = (e) => {
      updateQuizData({
        destination: e.target.value
      });
    };
  
    const handleTravelWithChange = (type) => {
      const newTravelWith = quizData.travel_with.includes(type)
        ? quizData.travel_with.filter(item => item !== type)
        : [...quizData.travel_with, type];
  
      updateQuizData({
        travel_with: newTravelWith
      });
    };
  
    const handleExperienceChange = (type) => {
      const newExperiences = quizData.activity_preferences.includes(type)
        ? quizData.activity_preferences.filter(item => item !== type)
        : [...quizData.activity_preferences, type];
  
      updateQuizData({
        activity_preferences: newExperiences
      });
    };

    return (
      <div className="min-h-screen flex">
        {/* Affichage des erreurs si présentes */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}


      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col relative">
        <Link to="/">
          <img src={Logo} alt="Stella" className="h-8 mb-16" />
        </Link>

        <div className="flex-grow flex flex-col">
          <DateTravelSelector 
            onChange={handleDateTravelChange}
            initialData={{
              startDate: quizData.departure_date,
              endDate: quizData.return_date,
              travelers: quizData.number_of_travelers,
              rooms: quizData.number_of_rooms
            }}
          />
  
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-4">Où voulez-vous partir?</h3>
            <div className="relative">
              <select
                value={quizData.destination}
                onChange={handleDestinationChange}
                className="w-full p-4 border border-[#9557fa] rounded-xl appearance-none bg-white
                          focus:outline-none focus:border-[#9557fa] focus:ring-1 focus:ring-[#9557fa]
                          text-gray-700"
              >
                <option value="">Sélectionnez une destination</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
            {/* Avec qui voyagez-vous ? */}
            <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Avec qui voyagez-vous ?</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'seul', label: 'Seul(e)' },
                { id: 'couple', label: 'En couple' },
                { id: 'famille', label: 'En famille' },
                { id: 'famille-enfants', label: 'En famille avec des jeunes enfants' },
                { id: 'amis', label: 'Entre amis' }
              ].map(option => (
                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={quizData.travel_with.includes(option.id)}
                      onChange={() => handleTravelWithChange(option.id)}
                      className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded checked:bg-[#9557fa]"
                    />
                  </div>
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
  
            {/* Type d'expérience */}
            <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">
              Quel type d'expérience souhaitez-vous à{' '}
              <span className="text-[#9557fa]">{quizData.destination || '[Destination]'}</span> ?
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'detente', label: 'Détente (plages, spas, etc...)' },
                { id: 'nature', label: 'Nature et aventures (randonnées, parcs naturels, etc...)' },
                { id: 'culture', label: 'Découverte urbaine (musée, monuments, vie nocturne)' },
                { id: 'gastronomie', label: 'Gastronomie et vins' },
                { id: 'shopping', label: 'Shopping' }
              ].map(exp => (
                <label key={exp.id} className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={quizData.activity_preferences.includes(exp.id)}
                      onChange={() => handleExperienceChange(exp.id)}
                      className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded checked:bg-[#9557fa]"
                    />
                  </div>
                  <span className="text-sm text-gray-700">{exp.label}</span>
                </label>
              ))}
            </div>
          </div>
  
            {/* Footer */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">3 minutes</span>
                <button 
                  onClick={() => navigate('/quiz/budget')}
                  className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-6 py-2 rounded-full text-sm"
                >
                Suivant
                </button>
              </div>
  
              {/* Barre de progression */}
              <div className="w-full bg-gray-100 h-0.5">
                <div
                  className="h-0.5 bg-[#9557fa] rounded-full"
                  style={{ width: '25%' }}
                />
              </div>
            </div>
          </div>
        </div>
  
        {/* Colonne de droite - Image */}
        <div className="hidden lg:block w-1/2">
          <img
            src={VolcanoImage}
            alt="Volcan"
            className="w-full h-screen object-cover"
          />
        </div>
      </div>
    );
  }
  
  export default Questions;