import React from 'react';
import UseCaseImg from '../assets/images/Usecase.png';

const CreateTripSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          {/* Colonne gauche - Texte */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            {/* Étoile décorative en haut - cachée sur mobile */}
            <div className="relative hidden md:block">
              <span className="absolute -right-8 -top-8 text-[#fa9b3d] text-2xl">✧</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-[#9557fa] mb-4 sm:mb-6 text-center lg:text-left">
              Créez des voyages uniques
            </h2>
            
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="text-base sm:text-lg text-gray-700 text-center lg:text-left">
                Répondez à quelques questions simples
              </p>
              <p className="text-base sm:text-lg text-gray-700 text-center lg:text-left">
                Recevez des suggestions personnalisées
              </p>
              <p className="text-base sm:text-lg text-gray-700 text-center lg:text-left">
                Découvrez des hébergements adaptés à vos envies
              </p>
              <p className="text-base sm:text-lg text-gray-700 text-center lg:text-left">
                Explorez des activités locales et authentiques
              </p>
              <p className="text-base sm:text-lg text-gray-700 text-center lg:text-left">
                Trouvez les meilleurs restaurants et bars
              </p>
            </div>
          </div>

          {/* Colonne droite - Image */}
          <div className="w-full lg:w-1/2 relative order-1 lg:order-2">
            <div className="rounded-xl overflow-hidden">
              <img 
                src={UseCaseImg} 
                alt="usecase" 
                className="w-full h-auto object-contain mx-auto max-w-[500px] lg:max-w-none"
              />
            </div>

            {/* Étoile décorative en bas - cachée sur mobile */}
            <div className="relative hidden md:block">
              <span className="absolute left-8 -bottom-8 text-[#fa9b3d] text-2xl">✧</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateTripSection;