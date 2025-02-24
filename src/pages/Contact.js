import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== '' && email.trim() !== '' && message.trim() !== '') {
      console.log("Message envoyé:", { name, email, message });
      setName('');
      setEmail('');
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

      {/* Contact Section */}
      <section className="py-16 px-6 sm:px-12 md:px-20 lg:px-32">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#9557fa]">Nous Contacter</h2>
        <p className="text-lg text-center text-gray-700 mt-4 max-w-2xl mx-auto">
          Remplissez le formulaire ci-dessous pour nous contacter. Nous vous répondrons dans les plus brefs délais.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <label className="block text-gray-700 text-lg font-semibold">Nom :</label>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9557fa]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            required
          />

          <label className="block text-gray-700 text-lg font-semibold mt-4">Email :</label>
          <input
            type="email"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9557fa]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            required
          />

          <label className="block text-gray-700 text-lg font-semibold mt-4">Message :</label>
          <textarea
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9557fa]"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre message..."
            required
          ></textarea>
          
          <button
            type="submit"
            className="mt-4 w-full bg-[#fa9b3d] text-white py-3 rounded-full hover:bg-[#fa9b3d]/90 transition-all text-lg">
            Envoyer
          </button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
