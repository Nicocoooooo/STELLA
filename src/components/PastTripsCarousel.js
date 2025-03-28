import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PastTripsCarousel({ trips }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState('md');

  // Détecter la taille de l'écran
  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth >= 1280) {
        setScreenSize('xl');
      } else if (window.innerWidth >= 1024) {
        setScreenSize('lg');
      } else if (window.innerWidth >= 768) {
        setScreenSize('md');
      } else if (window.innerWidth >= 640) {
        setScreenSize('sm');
      } else {
        setScreenSize('xs');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Obtenir les voyages visibles en fonction de la taille d'écran
  const getVisibleTrips = () => {
    const totalTrips = trips.length;
    
    // Si nous n'avons pas assez de voyages
    if (totalTrips <= 1) return [0];
    if (totalTrips <= 3) return [...Array(totalTrips)].map((_, i) => i);
    
    const prev = (currentIndex - 1 + totalTrips) % totalTrips;
    const next = (currentIndex + 1) % totalTrips;
    
    // Pour les écrans larges (xl, lg), montrer 5 éléments
    if (screenSize === 'xl' || screenSize === 'lg') {
      const prev2 = (currentIndex - 2 + totalTrips) % totalTrips;
      const next2 = (currentIndex + 2) % totalTrips;
      return [prev2, prev, currentIndex, next, next2];
    }
    
    // Pour les écrans moyens (md), montrer 3 éléments
    if (screenSize === 'md') {
      return [prev, currentIndex, next];
    }
    
    // Pour les petits écrans (sm), montrer 1-3 éléments
    if (screenSize === 'sm') {
      return [prev, currentIndex, next];
    }
    
    // Pour les très petits écrans (xs), montrer 1 élément
    return [currentIndex];
  };

  // Navigation automatique désactivée

  const navigate = (direction) => {
    if (direction === 'prev') {
      setCurrentIndex((current) => 
        (current - 1 + trips.length) % trips.length
      );
    } else {
      setCurrentIndex((current) => 
        (current + 1) % trips.length
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  // Si aucun voyage, ne rien afficher
  if (!trips || trips.length === 0) {
    return null;
  }

  const visibleTrips = getVisibleTrips();
  const centerIndex = Math.floor(visibleTrips.length / 2);

  // Hauteur fixe du conteneur
  const carouselHeightClass = 'h-96';

  // Classes spécifiques pour mobile - ajoute une marge en haut
  const mobileClasses = screenSize === 'xs' ? 'mt-8' : '';

  return (
    <div className={`relative ${mobileClasses}`}>
      {/* Conteneur principal avec hauteur fixe */}
      <div className={`relative overflow-hidden ${carouselHeightClass}`}>
        <div className="flex items-center justify-center h-full">
          {/* Bouton précédent */}
          <button 
            onClick={() => navigate('prev')}
            className="text-[#9557fa] hover:bg-purple-50 rounded-full p-1 sm:p-2 text-base sm:text-lg md:text-xl z-10 flex-shrink-0"
            aria-label="Précédent"
          >
            ❮
          </button>

          {/* Images du carrousel */}
          <div className="flex items-center justify-center mx-auto overflow-hidden">
            {visibleTrips.map((tripIndex, i) => {
              const trip = trips[tripIndex];
              const isCentered = i === centerIndex;
              
              return (
                <Link 
                  key={trip.id}
                  to={`/past-trips/${trip.id}`}
                  className={`relative transition-all duration-500 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden mx-1 sm:mx-2
                    ${isCentered 
                      ? 'w-72 h-96 sm:w-56 sm:h-80 md:w-80 md:h-96' 
                      : 'w-24 h-56 sm:w-40 sm:h-64 md:w-60 md:h-80'}`}
                >
                  <img
                    src={trip.destinations.image_url}
                    alt={trip.destinations.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                    <h3 className={`text-white font-bold ${
                      isCentered 
                        ? 'text-base sm:text-lg md:text-2xl' 
                        : 'text-xs sm:text-sm md:text-base'
                    }`}>
                      {trip.destinations.name}
                    </h3>
                    <p className={`text-white ${
                      isCentered 
                        ? 'text-sm sm:text-sm' 
                        : 'text-[10px] sm:text-xs'
                    }`}>
                      {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </p>
                    <p className={`text-white ${
                      isCentered 
                        ? 'text-sm sm:text-sm' 
                        : 'text-[10px] sm:text-xs'
                    }`}>
                      {new Date(trip.start_date).getFullYear()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bouton suivant */}
          <button 
            onClick={() => navigate('next')}
            className="text-[#9557fa] hover:bg-purple-50 rounded-full p-1 sm:p-2 text-base sm:text-lg md:text-xl z-10 flex-shrink-0"
            aria-label="Suivant"
          >
            ❯
          </button>
        </div>
      </div>
      
      {/* Points de pagination */}
      <div className="flex justify-center gap-1 sm:gap-2 mt-4 flex-wrap">
        {trips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300 
              ${currentIndex === index ? 'bg-[#fa9b3d] w-4 sm:w-6 md:w-8' : 'bg-gray-300'}`}
            aria-label={`Aller au voyage ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PastTripsCarousel;