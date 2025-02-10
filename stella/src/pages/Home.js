import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full p-4 flex justify-between items-center z-50">
        {/* Logo */}
        <Link to="/" className="text-purple-600 text-2xl font-bold">
          Stella
        </Link>
        
        {/* Navigation links */}
        <div className="flex gap-4 items-center">
          <Link to="/signup" className="text-gray-800 hover:text-gray-600">
            S'inscrire
          </Link>
          <Link 
            to="/start" 
            className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/api/placeholder/1920/1080" 
            alt="Mountain landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-white mb-6">
              Planifiez votre voyage idéal en quelques clics
            </h1>
            <h2 className="text-3xl text-white mb-12">
              L'organisateur de voyage intelligent
            </h2>
            <div className="flex justify-center gap-4">
              <button className="bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors">
                Commencer l'aventure
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-white hover:bg-white/10 rounded-lg transition-colors">
                <span className="text-purple-400">▶</span>
                Lancer la vidéo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;