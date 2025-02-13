import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import VolcanoImage from '../assets/images/Volcano.png';
import DateTravelSelector from '../components/DateTravelSelector';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';


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
    { id: 'singapore', name: 'Singapour' },
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
    const [travelInfo, setTravelInfo] = useState({
      dates: {
        startDate: new Date(),
        endDate: new Date(),
        travelers: 4,
        rooms: 2
      },
      destination: '',
      travelWith: [],
      experiences: []
    });
  
    const handleDateTravelChange = (newDates) => {
      setTravelInfo(prev => ({
        ...prev,
        dates: newDates
      }));
    };
  
    const handleDestinationChange = (e) => {
      setTravelInfo(prev => ({
        ...prev,
        destination: e.target.value
      }));
    };
  
    const handleCheckboxChange = (field, value) => {
      setTravelInfo(prev => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter(item => item !== value)
          : [...prev[field], value]
      }));
    };
  
    return (
      <div className="min-h-screen flex">
        {/* Colonne de gauche */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col relative">
          {/* Logo */}
          <Link to="/">
            <img src={Logo} alt="Stella" className="h-8 mb-16" />
          </Link>
  
          {/* Contenu principal */}
          <div className="flex-grow flex flex-col">
            {/* Sélecteur de dates et voyageurs */}
            <DateTravelSelector onChange={handleDateTravelChange} />
  
            {/* Sélecteur de destination */}
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-4">Où voulez-vous partir?</h3>
              <div className="relative">
                <select
                  value={travelInfo.destination}
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
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-[#9557fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
                        checked={travelInfo.travelWith.includes(option.id)}
                        onChange={() => handleCheckboxChange('travelWith', option.id)}
                        className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded checked:bg-[#9557fa]"
                      />
                      {travelInfo.travelWith.includes(option.id) && (
                        <svg className="absolute top-0.5 left-0.5 w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
  
            {/* Type d'expérience */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">
                Quel type de d'expérience souhaitez-vous à{' '}
                <span className="text-[#9557fa]">{travelInfo.destination || '[Destination]'}</span> ?
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
                        checked={travelInfo.experiences.includes(exp.id)}
                        onChange={() => handleCheckboxChange('experiences', exp.id)}
                        className="appearance-none w-4 h-4 border-2 border-[#9557fa] rounded checked:bg-[#9557fa]"
                      />
                      {travelInfo.experiences.includes(exp.id) && (
                        <svg className="absolute top-0.5 left-0.5 w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
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