// src/pages/QuizConfirmation.js
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';

function QuizConfirmation() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="py-8">
          <Link to="/">
            <img src={Logo} alt="Stella" className="h-8" />
          </Link>
        </div>

        {/* Contenu */}
        <div className="text-center py-16 sm:py-24">
          <h1 className="text-4xl font-bold text-[#9557fa] mb-4">
            Merci d'avoir complété le questionnaire !
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Nous allons créer le voyage de vos rêves sur mesure.
          </p>

          <div className="mt-8 space-y-4">
            <p className="text-gray-500">
              Nous vous contacterons bientôt avec une proposition personnalisée.
            </p>
            
            <Link 
              to="/ComposeVoyage"
              className="inline-block bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-8 py-3 rounded-full text-lg hover:opacity-90 transition-all"
            >
              Composer votre voyage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizConfirmation;