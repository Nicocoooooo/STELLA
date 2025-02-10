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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Partenaires hôteliers */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-16">
            Nos Partenaires
          </h2>
          <div className="flex justify-center items-center gap-16">
            <img 
              src={HyattLogo} 
              alt="Hyatt Place" 
              className="h-16 object-contain"
            />
            <img 
              src={HiltonLogo} 
              alt="Hilton Hotels & Resorts" 
              className="h-16 object-contain"
            />
            <img 
              src={ShangrilaLogo} 
              alt="Shangri-La" 
              className="h-16 object-contain"
            />
            <img 
              src={AccorLogo} 
              alt="Accor Hotels" 
              className="h-16 object-contain"
            />
          </div>
        </div>

        {/* Mentions presse */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-16">
            Ils parlent de nous
          </h2>
          <div className="bg-[#fa9b3d] py-12">
            <div className="flex justify-center items-center gap-16">
              <img 
                src={ForbesLogo} 
                alt="Forbes" 
                className="h-8 object-contain brightness-0 invert"
              />
              <img 
                src={ElleLogo} 
                alt="Elle" 
                className="h-8 object-contain brightness-0 invert"
              />
              <img 
                src={VogueLogo} 
                alt="Vogue" 
                className="h-8 object-contain brightness-0 invert"
              />
              <img 
                src={NytLogo} 
                alt="The New York Times" 
                className="h-8 object-contain brightness-0 invert"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;