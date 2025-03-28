import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Logo from '../assets/images/Logo.png';
import TravelJournal from '../components/TravelJournal';
import TravelMap from '../components/TravelMap';
import ProfileMenu from '../components/UserProfile/ProfileMenu_User'; // Import du composant ProfileMenu

function PastTripDetail() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    // Vérification immédiate de l'authentification
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log("Aucun utilisateur connecté, redirection vers la page de connexion");
      navigate('/login', { replace: true });
      return;
    } else {
      setIsAuthenticated(true);
    }

    const fetchTripDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('trips')
          .select(`
            id,
            start_date,
            end_date,
            status,
            user_id,
            destinations (
              id,
              name,
              country,
              image_url,
              description
            )
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Vérifier que le voyage appartient à l'utilisateur connecté
        if (data.user_id !== userId) {
          console.log("Ce voyage ne vous appartient pas");
          navigate('/past-trips', { replace: true });
          return;
        }
        
        setTripDetails(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du voyage:', error);
        navigate('/past-trips', { replace: true });
      } finally {
        setLoading(false);
      }
    };
  
    if (isAuthenticated) {
      fetchTripDetails();
    }
  }, [id, navigate, isAuthenticated]);

  // Si l'utilisateur n'est pas authentifié, on ne rend rien
  // La redirection sera gérée par le useEffect
  if (!isAuthenticated && !loading) {
    return null;
  }

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen font-['Outfit'] bg-white">
      {/* Header - Responsive */}
      <header className="py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 flex justify-between items-center relative z-50">
        <Link to="/">
          <img src={Logo} alt="Stella" className="h-6 sm:h-8 md:h-10" />
        </Link>
        <div className="flex items-center">
          <ProfileMenu />
        </div>
      </header>

      {/* Contenu principal */}
      <main className="pb-6 sm:pb-8 md:pb-12">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9557fa]"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Chargement des détails du voyage...</p>
          </div>
        ) : tripDetails ? (
          <>
            {/* Bannière avec image de destination et informations - Pleine largeur */}
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 mb-8">
              <img 
                src={tripDetails.destinations.image_url} 
                alt={tripDetails.destinations.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              
              {/* Container avec le même padding que le reste du contenu */}
              <div className="absolute bottom-0 left-0 w-full">
                <div className="container mx-auto px-4 sm:px-6 md:px-8">
                  <div className="pb-6 text-left text-white">
                    <h1 className="text-3xl md:text-5xl font-bold">{tripDetails.destinations.name}</h1>
                    <p className="text-l md:text-xl mt-2">
                      {formatDate(tripDetails.start_date)} - {formatDate(tripDetails.end_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu côte à côte sur desktop, empilé sur mobile */}
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carnet de voyage */}
                <TravelJournal />
                
                {/* Carte */}
                <TravelMap destination={tripDetails.destinations}/>
              </div>
            </div>
            {/* Étoile décorative - Responsive */}
            <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
                <span className="text-[#fa9b3d] text-xl sm:text-2xl">✧</span>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">Ce voyage n'existe pas ou a été supprimé.</p>
            <Link
              to="/past-trips"
              className="mt-4 inline-block bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-6 py-2 rounded-full"
            >
              Retour à mes voyages
            </Link>
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
            <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-0">© 2024 Stella. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PastTripDetail;