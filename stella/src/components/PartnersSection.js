import React from 'react';
import HyattLogo from '../assets/images/hyatt.png';
import HiltonLogo from '../assets/images/hilton.png';
import ShangrilaLogo from '../assets/images/shangrila.png';
import AccorLogo from '../assets/images/accor.png';
import ForbesLogo from '../assets/images/forbes.png';
import ElleLogo from '../assets/images/elle.png';
import VogueLogo from '../assets/images/vogue.png';
import NytLogo from '../assets/images/nyt.png';

const PartnersSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partenaires hôteliers */}
        <div className="mb-12 sm:mb-16 md:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
            Nos Partenaires
          </h2>
          {/* Grid pour mobile, flex pour desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:justify-center items-center gap-8 sm:gap-12 lg:gap-16">
            <img 
              src={HyattLogo} 
              alt="Hyatt Place" 
              className="h-12 sm:h-16 md:h-20 object-contain mx-auto"
            />
            <img 
              src={HiltonLogo} 
              alt="Hilton Hotels & Resorts" 
              className="h-12 sm:h-16 md:h-20 object-contain mx-auto"
            />
            <img 
              src={ShangrilaLogo} 
              alt="Shangri-La" 
              className="h-12 sm:h-16 md:h-20 object-contain mx-auto"
            />
            <img 
              src={AccorLogo} 
              alt="Accor Hotels" 
              className="h-12 sm:h-16 md:h-20 object-contain mx-auto"
            />
          </div>
        </div>

        {/* Mentions presse */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
            Ils parlent de nous
          </h2>
          <div className="bg-[#fa9b3d] py-8 sm:py-10 md:py-12">
            {/* Grid pour mobile, flex pour desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:justify-center items-center gap-8 sm:gap-12 lg:gap-16 px-4 sm:px-6 lg:px-8">
              <img 
                src={ForbesLogo} 
                alt="Forbes" 
                className="h-6 sm:h-7 md:h-8 object-contain brightness-0 invert mx-auto"
              />
              <img 
                src={ElleLogo} 
                alt="Elle" 
                className="h-7 sm:h-8 md:h-10 object-contain brightness-0 invert mx-auto"
              />
              <img 
                src={VogueLogo} 
                alt="Vogue" 
                className="h-7 sm:h-8 md:h-10 object-contain brightness-0 invert mx-auto"
              />
              <img 
                src={NytLogo} 
                alt="The New York Times" 
                className="h-16 sm:h-20 md:h-24 object-contain brightness-0 invert mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;