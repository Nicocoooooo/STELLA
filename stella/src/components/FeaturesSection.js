import React from 'react';
import FeatureImg from '../assets/images/Map.png';

const FeaturesSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre principal */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 px-4">
          Tout ce qu'il vous faut pour votre prochaine aventure
        </h2>

        {/* Carte avec ombre et coins arrondis */}
        <div className="max-w-4xl mx-auto bg-white rounded-[20px] sm:rounded-[30px] md:rounded-[40px] shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex flex-col items-center">
            {/* Image */}
            <div className="mb-4 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl overflow-hidden w-full sm:w-[85%] md:w-3/4 mx-auto">
              <img 
                src={FeatureImg} 
                alt="Avion au coucher du soleil" 
                className="w-full h-auto"
              />
            </div>

            {/* Texte descriptif */}
            <div className="text-center px-2 sm:px-4">
              <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-[#9557fa] mb-3 sm:mb-4">
                Photos, cartes et avis voyageurs
              </h3>
              <p className="text-base sm:text-lg text-gray-700 max-w-xl sm:max-w-2xl mx-auto">
                Plongez au cœur de votre destination. Des photos vibrantes,
                des cartes interactives et des avis authentiques pour vous
                projeter dans votre prochain voyage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;