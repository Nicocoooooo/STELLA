import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import NeomBg from '../assets/images/Neom.png';
import Filtre from '../assets/images/LandingpageFiltre.png';
import '../styles/MouseScroll.css';
import CarouselSection from '../components/CarouselSection';
import CreateTripSection from '../components/CreateTripSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import QuizSection from '../components/QuizSection';

import PartnersSection from '../components/PartnersSection';
import SocialSection from '../components/SocialSection';


function Home() {
  return (
    <div className="min-h-screen font-['Outfit']">
      {/* Navigation - Responsive */}
      <nav className="fixed w-full px-4 sm:px-8 py-4 flex justify-between items-center z-50">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Stella" className="h-8 sm:h-12" />
        </Link>
        
        <div className="flex gap-3 sm:gap-6 items-center">
          <Link 
            to="/signup" 
            className="text-black hover:text-[#ffe1c4] transition-colors text-sm sm:text-base"
          >
            S'inscrire
          </Link>
          <Link 
            to="/start" 
            className="bg-[#fa9b3d] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-[50px] hover:bg-[#fa9b3d]/90 transition-all text-sm sm:text-base"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section - Responsive */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <img 
            src={NeomBg}
            alt="Mountain landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 h-screen flex flex-col justify-center">
          <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-20">
            <div className="flex flex-col text-left max-w-[700px]">
              <h1 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight tracking-wide">
                Planifiez votre voyage idéal en quelques clics
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl text-white/90 mt-4 mb-8 sm:mb-12">
                L'organisateur de voyage intelligent
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <button className="w-full sm:w-auto bg-[#fa9b3d] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-[50px] hover:bg-[#fa9b3d]/90 transition-all text-base sm:text-lg">
                  Commencer l'aventure
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 text-base sm:text-lg hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-[50px] transition-all">
                  <span className="text-[#9557fa] text-xl">▶</span>
                  <span className="text-white">Lancer la vidéo</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mouse_scroll hidden md:block">
            {/* Mouse scroll content */}
          </div>
        </div>
      </div>

      {/* Section Personnalisation - Responsive */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-20">
          <div className="flex flex-col items-center justify-center gap-4 mb-8 sm:mb-16">
            <span className="text-[#fa9b3d] text-2xl">✧</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center px-4">
              Planifiez votre voyage en quelques clics
            </h2>
            <span className="text-[#fa9b3d] text-2xl">✧</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 text-left">
              <h3 className="text-3xl sm:text-4xl font-bold text-[#9557fa] text-left">
                Personnalisation intuitive
              </h3>
              <ul className="space-y-2 text-base sm:text-lg text-gray-700 text-left list-none">
                <li className="text-left">Choisissez votre saison idéale</li>
                <li className="text-left">Sélectionnez votre destination rêvée</li>
                <li className="text-left">Définissez votre style de voyage</li>
                <li className="text-left">Adaptez à votre budget</li>
              </ul>
            </div>

            <div className="relative mt-8 md:mt-0">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={Filtre}
                  alt="Avion au coucher du soleil" 
                  className="w-full h-full sm:h-[400px] md:h-[500px] object-contain"
                />
              </div>
              <span className="absolute -top-8 right-8 text-[#fa9b3d] text-2xl hidden sm:block">✧</span>
              <span className="absolute -bottom-8 left-8 text-[#fa9b3d] text-2xl hidden sm:block">✧</span>
            </div>
          </div>
        </div>
      </section>

      {/* Autres sections */}
      <CarouselSection />
      <CreateTripSection />
      <FeaturesSection />
      <TestimonialsSection />
      <QuizSection />
      <PartnersSection />
      <SocialSection />
    </div>
  );
}

export default Home;