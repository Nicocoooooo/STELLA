import React from 'react';
import UseCaseImg from '../assets/images/Usecase.png';

const CreateTripSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center gap-12">
          {/* Colonne gauche - Texte */}
          <div className="w-1/2">
            {/* Étoile décorative en haut */}
            <div className="relative">
              <span className="absolute -right-8 -top-8 text-[#fa9b3d] text-2xl">✧</span>
            </div>
            
            <h2 className="text-4xl font-bold text-[#9557fa] mb-6 text-left">
              Créez votre voyage unique
            </h2>
            
            <div className="flex flex-col gap-2 text-left">
              <p className="text-lg text-gray-700 text-left">Répondez à quelques questions simples</p>
              <p className="text-lg text-gray-700 text-left">Recevez des suggestions personnalisées</p>
              <p className="text-lg text-gray-700 text-left">Découvrez des hébergements adaptés</p>
              <p className="text-lg text-gray-700 text-left">Explorez des activités locales</p>
              <p className="text-lg text-gray-700 text-left">Trouvez les meilleurs restaurants</p>
            </div>
          </div>

          {/* Colonne droite - Image */}
          <div className="w-1/2 relative">
            <div className="rounded-xl overflow-hidden">
              <img 
                src={UseCaseImg} 
                alt="usecase" 
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Étoile décorative en bas */}
            <div className="relative">
              <span className="absolute left-8 -bottom-8 text-[#fa9b3d] text-2xl">✧</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateTripSection;