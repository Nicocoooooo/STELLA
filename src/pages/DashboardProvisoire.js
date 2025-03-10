import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Logo from '../assets/images/Logo.png';

function DashboardProvisoire() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, email, first_name, avatar_url')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setUser(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9557fa]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Outfit'] bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <img src={Logo} alt="Stella" className="h-10" />
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Bonjour, {user?.first_name || 'Utilisateur'}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#9557fa] mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil utilisateur */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#e9d9ff] flex items-center justify-center text-[#9557fa] text-2xl font-bold">
                {user?.first_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.full_name || 'Utilisateur'}</h2>
                <p className="text-gray-500">{user?.email || 'utilisateur@exemple.com'}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/profile"
                className="text-[#9557fa] hover:underline"
              >
                Modifier mon profil
              </Link>
            </div>
          </div>

          {/* Mes voyages */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mes Voyages</h2>
            <p className="text-gray-500 mb-6">Accédez à vos voyages passés et à venir</p>
            <div className="space-y-3">
              <Link
                to="/past-trips"
                className="block w-full bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white text-center px-4 py-2 rounded-full"
              >
                Mes Anciens Voyages
              </Link>
              <Link
                to="/upcoming-trips"
                className="block w-full bg-white border border-[#9557fa] text-[#9557fa] text-center px-4 py-2 rounded-full"
              >
                Mes Voyages à Venir
              </Link>
            </div>
          </div>

          {/* Planifier un voyage */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Planifier un Voyage</h2>
            <p className="text-gray-500 mb-6">Créez votre prochain itinéraire de voyage</p>
            <Link
              to="/quiz"
              className="block w-full bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white text-center px-4 py-2 rounded-full"
            >
              Nouveau Voyage
            </Link>
          </div>
        </div>

        {/* Destinations populaires */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#9557fa] mb-6">Destinations Populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Paris', 'Tokyo', 'New York', 'Bali'].map((city) => (
              <div key={city} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{city}</h3>
                  <p className="text-gray-500 text-sm">Découvrir</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2024 Stella. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link to="/about" className="text-gray-600 hover:text-[#9557fa]">About</Link>
              <Link to="/faq" className="text-gray-600 hover:text-[#9557fa]">FAQ</Link>
              <Link to="/aide" className="text-gray-600 hover:text-[#9557fa]">Aide</Link>
              <Link to="/contact" className="text-gray-600 hover:text-[#9557fa]">Nous contacter</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardProvisoire;