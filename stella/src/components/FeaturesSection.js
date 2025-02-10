import React from 'react';
import FeatureImg from '../assets/images/Map.png';

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Titre principal */}
        <h2 className="text-4xl font-bold text-center mb-16">
          Tout ce qu'il vous faut pour votre prochaine aventure
        </h2>

        {/* Carte avec ombre et coins arrondis */}
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-lg p-8">
          <div className="flex flex-col items-center">
            {/* Image */}
            <div className="mb-8 rounded-2xl overflow-hidden w-3/4 mx-auto">
              <img 
                src={FeatureImg} 
                alt="Avion au coucher du soleil" 
                className="w-full h-auto"
              />
            </div>

            {/* Texte descriptif */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-[#9557fa] mb-4">
                Photos, cartes et avis voyageurs
              </h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
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