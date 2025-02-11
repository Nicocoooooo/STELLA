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

  const getVisibleSlides = () => {
    const totalSlides = destinations.length;
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    const next = (currentIndex + 1) % totalSlides;
    return [prev, currentIndex, next];
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % destinations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
    <section className="py-12 sm:py-16 md:py-24 bg-white overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 lg:gap-0">
          {/* Carrousel - Responsive */}
          <div className="relative w-full lg:w-2/3">
            {/* Étoile décorative */}
            <div className="absolute -top-12 right-0 hidden md:block">
              <span className="text-[#fa9b3d] text-2xl">✧</span>
            </div>

            <div className="flex items-center">
              {/* Bouton précédent */}
              <button 
                onClick={() => navigate('prev')}
                className="text-[#9557fa] hover:bg-purple-50 rounded-full p-1 sm:p-2 text-lg sm:text-xl z-10"
              >
                ❮
              </button>

              {/* Images du carrousel */}
              <div className="flex items-center justify-center mx-auto overflow-hidden">
                {visibleSlides.map((index, i) => (
                  <div
                    key={destinations[index].id}
                    className={`relative transition-all duration-500 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden mx-1 sm:mx-2
                      ${i === 1 
                        ? 'w-36 h-48 sm:w-56 sm:h-72 md:w-80 md:h-96' 
                        : 'w-24 h-32 sm:w-40 sm:h-56 md:w-60 md:h-80'}`}
                  >
                    <img
                      src={destinations[index].image}
                      alt={destinations[index].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    {destinations[index].play && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-0 h-0 border-t-4 sm:border-t-6 md:border-t-8 border-t-transparent border-l-6 sm:border-l-8 md:border-l-12 border-l-white border-b-4 sm:border-b-6 md:border-b-8 border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                      <h3 className="text-white text-sm sm:text-lg md:text-2xl font-bold">
                        {destinations[index].name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton suivant */}
              <button 
                onClick={() => navigate('next')}
                className="text-[#9557fa] hover:bg-purple-50 rounded-full p-1 sm:p-2 text-lg sm:text-xl z-10"
              >
                ❯
              </button>
            </div>

            {/* Points de pagination */}
            <div className="flex justify-center gap-1 sm:gap-2 mt-4 sm:mt-6">
              {destinations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300 
                    ${currentIndex === index ? 'bg-[#fa9b3d] w-4 sm:w-6 md:w-8' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            {/* Étoile décorative */}
            <div className="absolute -bottom-12 left-0 hidden md:block">
              <span className="text-[#fa9b3d] text-2xl">✧</span>
            </div>
          </div>

          {/* Texte */}
          <div className="w-full lg:w-1/3 pl-0 lg:pl-12 pt-4 lg:pt-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#9557fa] mb-4 sm:mb-8 text-center lg:text-left">
              Laissez-vous inspirer
            </h2>
            <div className="flex flex-col gap-2 sm:gap-3 text-center lg:text-left">
              <p className="text-sm sm:text-base md:text-lg text-gray-700">Découvrez des vidéos immersives</p>
              <p className="text-sm sm:text-base md:text-lg text-gray-700">Explorez des photos authentiques</p>
              <p className="text-sm sm:text-base md:text-lg text-gray-700">Visualisez votre future destination</p>
              <p className="text-sm sm:text-base md:text-lg text-gray-700">Trouvez votre prochaine aventure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;