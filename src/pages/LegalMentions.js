import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import Footer from '../components/Footer';

const LegalMentions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-['Outfit'] bg-white text-gray-800 flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full px-6 sm:px-12 py-4 flex justify-between items-center z-50 bg-white shadow-md">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Stella" className="h-8 sm:h-10" />
        </Link>
      </nav>

      {/* Main Content with padding for fixed header */}
      <div className="flex-grow pt-24 md:pt-28">
        {/* Legal Mentions Section */}
        <section className="py-8 px-6 sm:px-12 md:px-20 lg:px-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#9557fa]">Mentions Légales</h2>
          <p className="text-lg text-center text-gray-700 mt-4 max-w-2xl mx-auto">
            Retrouvez ici les informations légales concernant l'utilisation de notre plateforme Stella.
          </p>

          <div className="mt-8 bg-white shadow-lg p-6 rounded-xl border border-gray-200 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-[#fa9b3d]">Éditeur du site</h3>
            <p className="text-gray-600 mt-2">Nom de l'entreprise : Stella Tech<br/>Adresse : 123 Rue de la Liberté, 75001 Paris<br/>Email : contact@stella.com</p>

            <h3 className="text-xl font-bold text-[#fa9b3d] mt-6">Hébergement</h3>
            <p className="text-gray-600 mt-2">Fournisseur : WebHost France<br/>Adresse : 45 Avenue du Web, 75002 Paris</p>

            <h3 className="text-xl font-bold text-[#fa9b3d] mt-6">Propriété intellectuelle</h3>
            <p className="text-gray-600 mt-2">Tous les contenus du site Stella (textes, images, logos) sont protégés par le droit d'auteur et ne peuvent être reproduits sans autorisation.</p>

            <h3 className="text-xl font-bold text-[#fa9b3d] mt-6">Données personnelles</h3>
            <p className="text-gray-600 mt-2">Les informations recueillies sont destinées à l'amélioration de nos services et ne seront en aucun cas vendues à des tiers.</p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LegalMentions;