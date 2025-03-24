import React, { useState, useEffect, useRef } from 'react';
import { Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/CarouselComponent.css';

const HotelCard = ({ hotel, onAddClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const placeholderImage = '/api/placeholder/400/320';

  const handleCardClick = (e) => {
    // Ne pas retourner la carte si on clique sur le bouton
    if (!e.target.closest('button')) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="card-perspective-wrapper">
  <div className="card-wrapper">
    <div 
      className={`card ${isFlipped ? 'is-flipped' : ''}`}
      onClick={handleCardClick}
    >
      {/* Face avant */}
      <div className="card-face card-front">
        <img 
          src={hotel.photo || placeholderImage} 
          alt={hotel.name || 'Hôtel'} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end">
          <h3 className="text-sm font-bold text-white px-3 py-1 rounded-md absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 text-center">
            {hotel.name || "Nom de l'hôtel inconnu"}
          </h3>
        </div>
      </div>

      {/* Face arrière */}
      <div className="card-face card-back bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white">
        <div className="p-4">
          <h3 className="text-xs font-bold text-white px-3 py-1 backdrop-blur-lg bg-white/30 rounded-md absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 text-center">
            {hotel.name || "Nom de l'hôtel inconnu"}
          </h3>
          
          <div className="text-xs mt-[50%]">
            {hotel.prix && (
              <div className="flex items-center">
                <p className="text-white text-left"><span className="font-medium text-white mr-2">Prix : </span>{hotel.prix}</p>
              </div>
            )}

            {hotel.rating && (
              <div className="flex items-center">
                <div className="flex items-center text-yellow-400 text-left">
                  <span className="font-medium text-white mr-2">Notation :</span>
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1 text-white text-left">{hotel.rating}/5 </span>
                </div>
              </div>
            )}

            {hotel.address && (
              <div className="flex items-start">
                <p className="text-white break-words text-left"><span className="font-medium text-white whitespace-nowrap mr-2">Adresse :</span>{hotel.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Bouton positionné absolument par rapport au wrapper */}
  <button 
    className={`action-button ${isFlipped ? 'is-flipped' : ''}`}
    onClick={(e) => {
      e.stopPropagation();
      onAddClick(hotel);
    }}
  >
    <Plus className="button-icon" size={20} />
  </button>
</div>
  );
};

const HotelCarousel = ({ hotels }) => {
  const [visibleCards, setVisibleCards] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [carouselStyles, setCarouselStyles] = useState({});
  const [cardStyles, setCardStyles] = useState({});

  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width >= 1280) setVisibleCards(4);
      else if (width >= 1024) setVisibleCards(3);
      else if (width >= 768) setVisibleCards(2);
      else setVisibleCards(1);
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    
    return () => {
      window.removeEventListener('resize', updateVisibleCards);
    };
  }, []);

  useEffect(() => {
    // Calculer les styles une fois que les visibleCards sont mis à jour
    const gap = 0;
    const cardWidth = `calc((100%) / ${visibleCards})`;
    
    setCardStyles({
      width: cardWidth, // Largeur calculée de la carte
      justifyContent: 'space-around',
      display : 'flex',
    });

    setCarouselStyles({
      transform: `translateX(calc(-${currentIndex * (100) / visibleCards}%))`,
    });
  }, [visibleCards, currentIndex]);

  // Limiter l'index maximum en fonction du nombre d'hôtels et de cartes visibles
  const maxIndex = Math.max(0, hotels.length - visibleCards);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleAddHotel = (hotel) => {
    console.log('Ajouter hôtel:', hotel);
    // Implémentez votre logique pour gérer le bouton d'ajout
  };

  if (hotels.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Hôtels</h3>
        <p className="text-gray-600">Aucun hôtel trouvé.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full py-8">
      <h3 className="text-xl font-bold mb-4">Hôtels</h3>
      
      <div className="carousel-outer">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`nav-button nav-prev ${currentIndex === 0 ? 'nav-disabled' : ''}`}
          aria-label="Précédent"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="carousel-container" ref={carouselRef}>
          <div 
            className="carousel-track"
            style={carouselStyles}
          >
            {hotels.map((hotel, index) => (
              <div 
                key={hotel.place_id || index} 
                className="carousel-item"
                style={cardStyles}
              >
                <HotelCard 
                  hotel={hotel}
                  onAddClick={handleAddHotel}
                />
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className={`nav-button nav-next ${currentIndex >= maxIndex ? 'nav-disabled' : ''}`}
          aria-label="Suivant"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default HotelCarousel;