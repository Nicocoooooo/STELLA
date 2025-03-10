import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 pb-6 sm:pb-8">
      {/* Logo et Newsletter */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0 mb-8 sm:mb-10 md:mb-12">
        {/* Logo Stella */}
        <div className="flex items-center">
          <img src={require('../../assets/images/Logo.png')} alt="Stella" className="h-8 sm:h-10 md:h-12" />
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
              className="rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 focus:outline-none focus:border-primary w-full sm:w-64 md:w-80"
            />
            <button className="rounded-full bg-gradient-to-r from-primary to-accent text-white px-6 sm:px-8 py-2 sm:py-3 font-outfit text-sm sm:text-base transition-all duration-300 hover:shadow-lg">
              S'inscrire
            </button>
          </div>
        </div>
      </div>

      {/* Navigation et Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6 sm:pt-8 gap-4 md:gap-0">
        {/* Navigation */}
        <nav className="order-2 md:order-1">
          <ul className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 md:gap-8">
            <li>
              <a href="/about" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base">
                About
              </a>
            </li>
            <li>
              <a href="/faq" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base">
                FAQ
              </a>
            </li>
            <li>
              <a href="/aide" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base">
                Aide
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base">
                Nous contacter
              </a>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-gray-400 text-xs sm:text-sm order-1 md:order-2">
          © 2025 Stella. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;