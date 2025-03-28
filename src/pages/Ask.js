import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import Footer from '../components/Footer';

const Ask = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() !== '') {
      console.log("Question soumise:", question);
      setQuestion('');
    }
  };

  return (
    <div className="min-h-screen font-['Outfit'] bg-white text-gray-800 flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full px-6 sm:px-12 py-4 flex justify-between items-center z-50 bg-white shadow-md">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Stella" className="h-8 sm:h-10" />
        </Link>
        <div className="flex gap-4 sm:gap-6 items-center">
          <Link to="/faq" className="text-black hover:text-[#9557fa] transition-colors text-sm sm:text-lg">Retour à la FAQ</Link>
        </div>
      </nav>

      {/* Main Content with padding for fixed header */}
      <div className="flex-grow pt-24 md:pt-28">
        {/* Ask Question Section */}
        <section className="py-8 px-6 sm:px-12 md:px-20 lg:px-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#9557fa]">Posez votre question</h2>
          <p className="text-lg text-center text-gray-700 mt-4 max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous pour poser votre question. Elle sera examinée par la communauté Stella.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-xl border border-gray-200">
            <label className="block text-gray-700 text-lg font-semibold">Votre question :</label>
            <textarea
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9557fa]"
              rows="4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Tapez votre question ici..."
              required
            ></textarea>
            <button
              type="submit"
              className="mt-4 w-full bg-[#fa9b3d] text-white py-3 rounded-full hover:bg-[#fa9b3d]/90 transition-all text-lg">
              Soumettre
            </button>
          </form>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Ask;