import React, { useState, useEffect } from 'react';
import LondonImg from '../assets/images/London.png';
import RioImg from '../assets/images/Rio.png';
import CanadaImg from '../assets/images/Canada.png';
import JaponImg from '../assets/images/Japan.png';
import LasvegasImg from '../assets/images/lasvegas.png';

const destinations = [
  {
    id: 1,
    name: 'London',
    image: LondonImg,
    play: false
  },
  {
    id: 2, 
    name: 'Rio',
    image: RioImg,
  },
  {
    id: 3,
    name: 'Canada',
    image: CanadaImg,
  },
  {
    id: 4,
    name: 'Japon',
    image: JaponImg,
  },
  {
    id: 5,
    name: 'Las Vegas',
    image: LasvegasImg,
  }
];

const CarouselSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calcule les indices des diapositives visibles
  const getVisibleSlides = () => {
    const totalSlides = destinations.length;
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    const next = (currentIndex + 1) % totalSlides;
    return [prev, currentIndex, next];
  };

  // Rotation automatique
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % destinations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Navigation
  const navigate = (direction) => {
    if (direction === 'prev') {
      setCurrentIndex((current) => 
        (current - 1 + destinations.length) % destinations.length
      );
    } else {
      setCurrentIndex((current) => 
        (current + 1) % destinations.length
      );
    }
  };

  const visibleSlides = getVisibleSlides();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start">
          {/* Carrousel à gauche */}
          <div className="relative w-2/3">
            {/* Étoile décorative en haut */}
            <div className="absolute -top-12 right-0">
              <span className="text-[#fa9b3d] text-2xl">✧</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Bouton précédent */}
              <button 
                onClick={() => navigate('prev')}
                className="text-[#9557fa] hover:bg-purple-50 rounded-full p-2"
              >
                ❮
              </button>

              {/* Images du carrousel */}
              <div className="flex items-center gap-4">
                {visibleSlides.map((index, i) => (
                  <div
                    key={destinations[index].id}
                    className={`relative transition-all duration-500 rounded-3xl overflow-hidden
                      ${i === 1 ? 'w-80 h-[400px]' : 'w-60 h-[300px]'}`}
                  >
                    <img
                      src={destinations[index].image}
                      alt={destinations[index].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    {destinations[index].play && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-white text-2xl font-bold">{destinations[index].name}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton suivant */}
              <button 
                onClick={() => navigate('next')}
                className="text-[#9557fa] hover:bg-purple-50 rounded-full p-2"
              >
                ❯
              </button>
            </div>

            {/* Points de pagination */}
            <div className="flex justify-center gap-2 mt-8">
              {destinations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 
                    ${currentIndex === index ? 'bg-[#fa9b3d] w-8' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            {/* Étoile décorative en bas */}
            <div className="absolute -bottom-12 left-0">
              <span className="text-[#fa9b3d] text-2xl">✧</span>
            </div>
          </div>

          {/* Texte à droite */}
          <div className="w-1/3 pl-12 pt-8">
            <h2 className="text-4xl font-bold text-[#9557fa] mb-8">
              Laissez-vous inspirer
            </h2>
            <div className="flex flex-col gap-3">
              <p className="text-lg text-gray-700">Découvrez des vidéos immersives</p>
              <p className="text-lg text-gray-700">Explorez des photos authentiques</p>
              <p className="text-lg text-gray-700">Visualisez votre future destination</p>
              <p className="text-lg text-gray-700">Trouvez votre prochaine aventure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;