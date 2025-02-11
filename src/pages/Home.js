import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
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
    <div className="min-h-screen font-['Outfit'] flex flex-col">
      {/* Navigation - Responsive */}
      <nav className="fixed w-full px-6 sm:px-12 py-4 flex justify-between items-center z-50 bg-white shadow-md">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Stella" className="h-8 sm:h-10" />
        </Link>
        <div className="flex gap-4 sm:gap-6 items-center">
          <Link to="/signup" className="text-black hover:text-[#9557fa] transition-colors text-sm sm:text-lg">
            S'inscrire
          </Link>
          <Link to="/start" className="bg-[#fa9b3d] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#fa9b3d]/90 transition-all text-sm sm:text-lg">
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex-grow flex items-center justify-center pt-24 pb-12 sm:pb-20">
        <div className="absolute inset-0">
          <img src={NeomBg} alt="Mountain landscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="font-bold text-white text-4xl sm:text-5xl md:text-6xl leading-tight tracking-wide">
            Planifiez votre voyage idéal en quelques clics
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl text-white/80 mt-4 mb-8 sm:mb-10">
            L'organisateur de voyage intelligent
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <button className="w-full sm:w-auto bg-[#fa9b3d] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-xl shadow-md hover:bg-[#fa9b3d]/90 transition-all">
              Commencer l'aventure
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 text-lg sm:text-xl bg-[#333]/60 hover:bg-[#333]/80 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all text-white shadow-md">
              <span className="text-[#9557fa] text-2xl">▶</span>
              Lancer la vidéo
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <CarouselSection />
        <CreateTripSection />
        <FeaturesSection />
        <TestimonialsSection />
        <QuizSection />
        <PartnersSection />
        <SocialSection />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6 sm:px-12 mt-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Stella" className="h-8 sm:h-10" />
          </Link>
          <nav className="flex flex-wrap gap-6 text-gray-700 text-sm mt-6 md:mt-0">
            <Link to="/about" className="hover:text-[#9557fa]">About</Link>
            <Link to="/faq" className="hover:text-[#9557fa]">FAQ</Link>
            <Link to="/help" className="hover:text-[#9557fa]">Aide</Link>
            <Link to="/contact" className="hover:text-[#9557fa]">Nous contacter</Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2024 Stella. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/cgu" className="hover:text-[#9557fa]">CGU</Link>
            <Link to="/mentions-legales" className="hover:text-[#9557fa]">Mentions légales</Link>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-[#9557fa]">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#9557fa]">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#9557fa]">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#9557fa]">
              <FaTiktok />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
