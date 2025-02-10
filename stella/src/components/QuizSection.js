import React from 'react';
import BalloonsImg from '../assets/images/Turquie.png';

const QuizSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Titre principal */}
        <h2 className="text-4xl font-bold text-center mb-16">
          Créez votre premier itinéraire en 5 minutes
        </h2>

        {/* Container avec image et texte */}
        <div className="max-w-6xl mx-auto bg-gray-50 rounded-[40px] overflow-hidden">
          <div className="flex">
            {/* Image des montgolfières */}
            <div className="w-2/3">
              <img 
                src={BalloonsImg}
                alt="Montgolfières au coucher du soleil"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu à droite */}
            <div className="w-1/3 p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-[#9557fa] mb-6">
                Quel est votre style de voyage ?
              </h3>
              <p className="text-lg text-gray-700 mb-8 text-center">
                Répondez à quelques questions et laissez-nous vous guider vers des expériences qui vous correspondent parfaitement.
              </p>
              <button className="bg-[#fa9b3d] text-white px-8 py-4 rounded-[50px] hover:bg-[#fa9b3d]/90 transition-all text-lg w-fit mx-auto">
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