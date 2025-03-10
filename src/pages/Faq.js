import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [questions, setQuestions] = useState([
    { question: "Comment utiliser Stella ?", answer: "Stella est une plateforme intuitive qui vous permet d'organiser vos voyages en quelques clics." },
    { question: "Stella est-elle gratuite ?", answer: "Oui, l'utilisation de Stella est gratuite pour les fonctionnalités de base. Des options premium sont disponibles." },
  ]);

  return (
    <div className="min-h-screen font-['Outfit'] bg-white text-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full px-6 sm:px-12 py-4 flex justify-between items-center z-50 bg-white shadow-md">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Stella" className="h-8 sm:h-10" />
        </Link>
        <div className="flex gap-4 sm:gap-6 items-center">
          <Link to="/" className="text-black hover:text-[#9557fa] transition-colors text-sm sm:text-lg">Accueil</Link>
          <Link to="/faq" className="bg-[#fa9b3d] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#fa9b3d]/90 transition-all text-sm sm:text-lg">Poser une Question</Link>
        </div>
      </nav>

      {/* FAQ Section */}
      <section className="py-16 px-6 sm:px-12 md:px-20 lg:px-32">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#9557fa]">FAQ</h2>
        <p className="text-lg text-center text-gray-700 mt-4 max-w-2xl mx-auto">
          Retrouvez ici les questions les plus fréquentes et leurs réponses. Vous pouvez également poser vos propres questions.
        </p>

        <div className="mt-8 space-y-6">
          {questions.map((item, index) => (
            <div key={index} className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-[#fa9b3d]">{item.question}</h3>
              <p className="text-gray-600 mt-2">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#9557fa] text-white text-center py-12 px-6">
        <h2 className="text-3xl font-bold">Vous avez une question ?</h2>
        <p className="text-lg mt-4">Posez votre question et obtenez une réponse de la communauté Stella.</p>
        <Link to="/ask" className="mt-6 inline-block bg-[#fa9b3d] text-white px-6 py-3 rounded-full hover:bg-[#fa9b3d]/90 text-lg">
          Poser une Question
        </Link>
      </section>
    </div>
  );
};

export default FAQ;

//commentaire pour merge avec TremplinFooter
