import React from 'react';
import { Link } from 'react-router-dom';
import BalloonImage from '../assets/images/Turkie.png';
import Logo from '../assets/images/Logo.png';

function Quiz() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Colonne de gauche */}
      <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col">
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="Stella" className="h-8 sm:h-10 md:h-12 mb-12 sm:mb-16 md:mb-20 lg:mb-24" />
        </Link>

        {/* Contenu principal */}
        <div className="flex-grow flex flex-col justify-center max-w-xl">
          {/* Section textes */}
          <div className="mb-auto">
            <h2 className="text-[#9557fa] text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight text-center lg:text-left">
              <span className="block">Créez votre voyage sur</span>
              <span className="block">mesure</span>
            </h2>
            
            <h3 className="text-[#fa9b3d] text-xl sm:text-2xl md:text-3xl font-normal mb-6 sm:mb-8 text-center lg:text-left">
              Questionnaire Stella
            </h3>
            
            <p className="text-gray-700 text-base sm:text-lg text-center lg:text-left max-w-md mx-auto lg:mx-0">
              Répondez à quelques questions et laissez-nous créer le voyage
              de vos rêves
            </p>
          </div>

          {/* Footer avec temps et bouton */}
          <div className="mt-12 sm:mt-16 md:mt-20">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600 text-sm sm:text-base md:text-lg">3 minutes</span>
              <Link
                to="/quiz/questions"
                className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-8 sm:px-10 md:px-12 py-2.5 sm:py-3 rounded-full hover:opacity-90 transition-all text-sm sm:text-base md:text-lg"
              >
                Commencer
              </Link>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-gray-100 h-0.5">
              <div 
                className="bg-gray-300 h-0.5" 
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Colonne de droite avec image */}
      <div className="hidden lg:block w-1/2 h-screen">
        <img
          src={BalloonImage}
          alt="Montgolfières au coucher du soleil"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Quiz;