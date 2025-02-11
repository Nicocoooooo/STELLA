import React from 'react';
import { Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-24 pb-8">
      {/* Logo et Newsletter */}
      <div className="flex justify-between items-start mb-12">
        {/* Logo Stella */}
        <div className="flex items-center">
          <img src={require('../../assets/images/Logo.png')} alt="Stella" className="h-12" />
        </div>

        {/* Newsletter */}
        <div className="flex flex-col items-end">
          <p className="text-gray-600 mb-4">
            Inspirations voyage.<br />
            Recevez nos plus belles destinations et offres exclusives.
          </p>
          <div className="flex gap-4">
            <input 
              type="email" 
              placeholder="Votre E-mail" 
              className="rounded-full px-6 py-3 border border-gray-200 focus:outline-none focus:border-primary w-80"
            />
            <button className="rounded-full bg-gradient-to-r from-primary to-accent text-white px-8 py-3 font-outfit text-base transition-all duration-300 hover:shadow-lg">
              S'inscrire
            </button>
          </div>
        </div>
      </div>

      {/* Navigation et Copyright */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-8">
        {/* Navigation */}
        <nav>
          <ul className="flex gap-8">
            <li>
              <a href="/about" className="text-gray-600 hover:text-primary transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="/faq" className="text-gray-600 hover:text-primary transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="/aide" className="text-gray-600 hover:text-primary transition-colors">
                Aide
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                Nous contacter
              </a>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-gray-400 text-sm">
          © 2024 Stella. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;