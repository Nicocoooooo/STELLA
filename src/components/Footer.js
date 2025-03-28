import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';
import Logo from '../assets/images/Logo.png';

const Footer = () => {
  return (
    <footer className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 pb-6 sm:pb-8 w-full px-4 sm:px-6 md:px-8">
      {/* Logo et Newsletter */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0 mb-8 sm:mb-10 md:mb-12 max-w-screen-xl mx-auto">
        {/* Logo Stella */}
        <div className="flex items-center">
          <img src={Logo} alt="Stella" className="h-8 sm:h-10 md:h-12" />
        </div>

        {/* Newsletter */}
        <div className="flex flex-col items-center md:items-end">
          <p className="text-gray-600 mb-4 text-center md:text-right">
            Inspirations voyage.<br />
            Recevez nos plus belles destinations et offres exclusives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Votre E-mail" 
              className="rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 focus:outline-none focus:border-[#9557fa] w-full sm:w-64 md:w-80"
            />
            <button className="rounded-full bg-[#9557fa] text-white px-6 sm:px-8 py-2 sm:py-3 font-outfit text-sm sm:text-base transition-all duration-300 hover:shadow-lg">
              S'inscrire
            </button>
          </div>
        </div>
      </div>

      {/* Navigation, Copyright et Réseaux sociaux */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6 sm:pt-8 gap-4 md:gap-0 max-w-screen-xl mx-auto">
        {/* Navigation */}
        <nav className="order-2 md:order-1">
          <ul className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 md:gap-8">
            <li>
              <Link to="/about" className="text-gray-600 hover:text-[#9557fa] transition-colors text-sm sm:text-base">
                About
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-600 hover:text-[#9557fa] transition-colors text-sm sm:text-base">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/help" className="text-gray-600 hover:text-[#9557fa] transition-colors text-sm sm:text-base">
                Aide
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-[#9557fa] transition-colors text-sm sm:text-base">
                Nous contacter
              </Link>
            </li>
          </ul>
        </nav>

        {/* Copyright et liens légaux */}
        <div className="flex flex-col sm:flex-row items-center gap-4 order-1 md:order-2">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 Stella. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/ask" className="text-gray-400 hover:text-[#9557fa] transition-colors text-xs sm:text-sm">
              CGU
            </Link>
            <Link to="/legalmentions" className="text-gray-400 hover:text-[#9557fa] transition-colors text-xs sm:text-sm">
              Mentions légales
            </Link>
          </div>
        </div>
        
        {/* Réseaux sociaux */}
        <div className="flex gap-4 order-3">
          <a 
            href="https://www.facebook.com/stella" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-[#9557fa] transition-colors" 
            aria-label="Facebook"
          >
            <FaFacebook size={16} />
          </a>
          <a 
            href="https://www.twitter.com/stella" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-[#9557fa] transition-colors" 
            aria-label="Twitter"
          >
            <FaTwitter size={16} />
          </a>
          <a 
            href="https://www.instagram.com/stella" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-[#9557fa] transition-colors" 
            aria-label="Instagram"
          >
            <FaInstagram size={16} />
          </a>
          <a 
            href="https://www.tiktok.com/@stella" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-[#9557fa] transition-colors" 
            aria-label="TikTok"
          >
            <FaTiktok size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;