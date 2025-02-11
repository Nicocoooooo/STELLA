import React from 'react';
import BalloonsImg from '../assets/images/Turquie.png';

const QuizSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre principal */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 px-4">
          Créez votre premier itinéraire en 5 minutes
        </h2>

        {/* Container avec image et texte */}
        <div className="max-w-6xl mx-auto bg-gray-50 rounded-[20px] sm:rounded-[30px] md:rounded-[40px] overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image des montgolfières */}
            <div className="w-full lg:w-2/3 h-[300px] sm:h-[400px] lg:h-full">
              <img 
                src={BalloonsImg}
                alt="Montgolfières au coucher du soleil"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu */}
            <div className="w-full lg:w-1/3 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#9557fa] mb-4 sm:mb-6 text-center lg:text-left">
                Quel est votre style de voyage ?
              </h3>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 text-center lg:text-left">
                Répondez à quelques questions et laissez-nous vous guider vers des expériences qui vous correspondent parfaitement.
              </p>
              <button className="bg-[#fa9b3d] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-[50px] hover:bg-[#fa9b3d]/90 transition-all text-base sm:text-lg w-fit mx-auto lg:mx-0">
                Lancer le test
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;