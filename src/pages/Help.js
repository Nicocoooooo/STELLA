import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';

const Help = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject.trim() !== '' && message.trim() !== '') {
      console.log("Demande envoyée:", { subject, message });
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen font-['Outfit'] bg-white text-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full px-6 sm:px-12 py-4 flex justify-between items-center z-50 bg-white shadow-md">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Stella" className="h-8 sm:h-10" />
        </Link>
      </nav>

      {/* Help Section */}
      <section className="py-16 px-6 sm:px-12 md:px-20 lg:px-32">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#9557fa]">Contactez le Support</h2>
        <p className="text-lg text-center text-gray-700 mt-4 max-w-2xl mx-auto">
          Besoin d'aide ? Contactez notre équipe de support via le formulaire ci-dessous ou par email à <a href="mailto:support@stella.com" className="text-[#9557fa] underline">support@stella.com</a>.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <label className="block text-gray-700 text-lg font-semibold">Sujet :</label>
          <select
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9557fa]"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Sélectionnez un sujet</option>
            <option value="Problème technique">Problème technique</option>
            <option value="Demande de remboursement">Demande de remboursement</option>
            <option value="Suggestions d'amélioration">Suggestions d'amélioration</option>
            <option value="Compte et abonnement">Compte et abonnement</option>
            <option value="Autre">Autre</option>
          </select>

          <label className="block text-gray-700 text-lg font-semibold mt-4">Description :</label>
          <textarea
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9557fa]"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrivez votre demande ici..."
            required
          ></textarea>
          
          <button
            type="submit"
            className="mt-4 w-full bg-[#fa9b3d] text-white py-3 rounded-full hover:bg-[#fa9b3d]/90 transition-all text-lg">
            Envoyer la demande
          </button>
        </form>
      </section>
    </div>
  );
};

export default Help;
