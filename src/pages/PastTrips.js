import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import supabase from '../supabaseClient';
import PastTripsCarousel from '../components/PastTripsCarousel';
import ProfileHeader from '../components/UserProfile/ProfileHeader';

function PastTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérification immédiate de l'authentification
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log("Aucun utilisateur connecté, redirection vers la page de connexion");
      navigate('/login');
      return;
    } else {
      setIsAuthenticated(true);
    }

    const fetchPastTrips = async () => {
      try {
        const { data, error } = await supabase
          .from('trips')
          .select(`
            id,
            start_date,
            end_date,
            status,
            destinations (
              id,
              name,
              country,
              image_url
            )
          `)
          .eq('user_id', userId)
          .order('start_date', { ascending: false });
        
        console.log("Données récupérées:", data);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTrips(data);
        } else {
          setTrips([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des voyages:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (isAuthenticated) {
      fetchPastTrips();
    }
  }, [navigate, isAuthenticated]);

  // Si l'utilisateur n'est pas authentifié, on ne rend rien
  // La redirection sera gérée par le useEffect
  if (!isAuthenticated && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow w-full px-4 sm:px-8 md:px-12 lg:px-24 py-8 lg:py-12">
        <div className="max-w-[1800px] mx-auto">
          {/* Header - Responsive */}
          <ProfileHeader />

          {/* Contenu principal - Responsive */}
          <main className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#9557fa] mb-6 sm:mb-8 md:mb-12">Mes Anciens Voyages</h1>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9557fa]"></div>
                <p className="mt-4 text-gray-600 text-sm sm:text-base">Chargement de vos voyages...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-6 sm:py-8 md:py-10">
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Vous n'avez pas encore enregistré de voyage.</p>
                <Link
                  to="/quiz"
                  className="bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base"
                >
                  Planifier un voyage
                </Link>
              </div>
            ) : (
              <div className="relative">
                <PastTripsCarousel trips={trips} />
                
                {/* Étoile décorative - Responsive */}
                <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
                  <span className="text-[#fa9b3d] text-xl sm:text-2xl">✧</span>
                </div>
              </div>
            )}
          </main>

          {/* Footer - Responsive */}
          <footer className="py-4 sm:py-6 mt-auto border-t border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                  <Link to="/about" className="text-gray-600 hover:text-[#9557fa] text-xs sm:text-sm md:text-base">About</Link>
                  <Link to="/faq" className="text-gray-600 hover:text-[#9557fa] text-xs sm:text-sm md:text-base">FAQ</Link>
                  <Link to="/aide" className="text-gray-600 hover:text-[#9557fa] text-xs sm:text-sm md:text-base">Aide</Link>
                  <Link to="/contact" className="text-gray-600 hover:text-[#9557fa] text-xs sm:text-sm md:text-base">Nous contacter</Link>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-0">© 2025 Stella. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default PastTrips;