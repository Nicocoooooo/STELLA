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
      {/* Navigation */}
      <nav className="fixed w-full px-8 py-4 flex justify-between items-center z-50">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Stella" className="h-12" />
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link 
            to="/signup" 
            className="text-black hover:text-[#ffe1c4] transition-colors"
          >
            S'inscrire
          </Link>
          <Link 
            to="/start" 
            className="bg-[#fa9b3d] text-white px-6 py-2.5 rounded-[50px] hover:bg-[#fa9b3d]/90 transition-all"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={NeomBg}
            alt="Mountain landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-screen flex flex-col justify-center">
          <div className="container mx-auto px-20">
            <div className="flex flex-col text-left max-w-[700px]">
              <h1 className="font-bold text-white text-[64px] leading-tight tracking-wide">
                Planifiez votre voyage idéal en quelques clics
              </h1>
              <h2 className="text-3xl text-white/90 mt-4 mb-12">
                L'organisateur de voyage intelligent
              </h2>
              <div className="flex items-center gap-6">
                <button className="bg-[#fa9b3d] text-white px-8 py-4 rounded-[50px] hover:bg-[#fa9b3d]/90 transition-all text-lg">
                  Commencer l'aventure
                </button>
                <button className="flex items-center gap-3 text-lg hover:bg-white/10 px-8 py-4 rounded-[50px] transition-all">
                  <span className="text-[#9557fa] text-xl">▶</span>
                  <span className="text-white">Lancer la vidéo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mouse Scroll Indicator */}
          <div className="mouse_scroll">
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <div>
              <span className="m_scroll_arrows unu"></span>
              <span className="m_scroll_arrows doi"></span>
              <span className="m_scroll_arrows trei"></span>
            </div>
          </div>
        </div>
      </div>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-20">
          {/* En-tête de section avec étoile décorative */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className="text-[#fa9b3d] text-2xl">✧</span>
            <h2 className="text-4xl font-bold text-center">
              Planifiez votre voyage en quelques clics
            </h2>
            <span className="text-[#fa9b3d] text-2xl">✧</span>
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Colonne de gauche - Texte */}
            <div className="space-y-8 text-left">
              <h3 className="text-4xl font-bold text-[#9557fa] text-left">
                Personnalisation intuitive
              </h3>
              <ul className="space-y-2 text-lg text-gray-700 text-left list-none">
                <li className="text-left">Choisissez votre saison idéale</li>
                <li className="text-left">Sélectionnez votre destination rêvée</li>
                <li className="text-left">Définissez votre style de voyage</li>
                <li className="text-left">Adaptez à votre budget</li>
              </ul>
            </div>

            {/* Colonne de droite - Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={Filtre}
                  alt="Avion au coucher du soleil" 
                  className="w-full h-[300px] object-cover"
                />
              </div>
              {/* Étoiles décoratives */}
              <span className="absolute -top-8 right-8 text-[#fa9b3d] text-2xl">✧</span>
              <span className="absolute -bottom-8 left-8 text-[#fa9b3d] text-2xl">✧</span>
            </div>
          </div>
        </div>
      </section>
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