import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import Footer from '../components/Footer';

const About = () => {
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
        <div className="flex gap-4 sm:gap-6 items-center">
          <Link to="/" className="text-black hover:text-[#9557fa] transition-colors text-sm sm:text-lg">Accueil</Link>
          <Link to="/start" className="bg-[#fa9b3d] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#fa9b3d]/90 transition-all text-sm sm:text-lg">Commencer</Link>
        </div>
      </nav>

      {/* Main Content with padding for fixed header */}
      <div className="flex-grow">
        {/* Hero Section - Added padding-top to fix header overlap */}
        <header className="relative flex items-center justify-center h-[60vh] bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white text-center px-6 pt-16 mt-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold">Voyager sans stress, c'est notre mission</h1>
            <p className="text-lg sm:text-xl mt-4">Une plateforme intelligente née d'un constat simple : l'organisation d'un voyage est souvent un casse-tête. Stella vous simplifie la tâche.</p>
          </div>
        </header>

        {/* Content Section */}
        <section className="py-16 px-6 sm:px-12 md:px-20 lg:px-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#9557fa]">Pourquoi Stella ?</h2>
          <p className="text-lg text-center text-gray-700 mt-4 max-w-2xl mx-auto">
            Tout commence par une frustration : l'organisation d'un voyage demande du temps, entre la recherche d'hôtels, de restaurants ou d'activités. 
            Nous avons voulu créer un outil qui centralise tout sur une seule et même plateforme, pour que vous puissiez profiter pleinement de votre voyage, sans perdre des heures à tout organiser.
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#9557fa] mt-12">Notre équipe</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            {[
              { name: 'Margaux Feraudet', role: 'Designer UX' },
              { name: 'Rémi Cadoil', role: 'Développeur Full Stack' },
              { name: 'Nicolas Antoine', role: 'Expert en IA' },
              { name: 'Élise Collignon', role: 'Cheffe de produit' },
              { name: 'Élodie Lequin', role: 'Responsable Marketing' },
              { name: 'Thomas Tricard', role: 'Développeur Frontend' },
              { name: 'Alexandre Vachez', role: 'Architecte Backend' },
            ].map((person, index) => (
              <div key={index} className="bg-white shadow-lg p-6 rounded-xl text-center border border-gray-200">
                <h3 className="text-xl font-bold text-[#fa9b3d]">{person.name}</h3>
                <p className="text-gray-600 mt-2">{person.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#9557fa] text-white text-center py-12 px-6">
          <h2 className="text-3xl font-bold">Prêt à transformer votre manière de voyager ?</h2>
          <p className="text-lg mt-4">Utilisez Stella et laissez l'intelligence simplifier vos itinéraires, selon vos envies et vos besoins.</p>
          <Link to="/start" className="mt-6 inline-block bg-[#fa9b3d] text-white px-6 py-3 rounded-full hover:bg-[#fa9b3d]/90 text-lg">
            Essayez Stella maintenant
          </Link>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;