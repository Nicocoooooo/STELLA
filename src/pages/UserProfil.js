import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

import ProfileHeader from '../components/UserProfile/ProfileHeader';
import PersonalInfoForm from '../components/UserProfile/PersonalInfoForm';
import AvatarUpload from '../components/UserProfile/AvatarUpload';
import DeleteAccount from '../components/UserProfile/DeleteAccount';
import TravelPreferences from '../components/UserProfile/TravelPreferences';
import Footer from '../components/Footer';


function UserProfil() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('informations');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Récupérer l'ID utilisateur depuis le localStorage
        const userId = localStorage.getItem('userId');

        if (!userId) {
          setError('Aucun utilisateur connecté (userId manquant dans localStorage).');
          setLoading(false);
          return;
        }

        // 2) Charger le profil dans la table `users`
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        console.log('Résultat userData:', userData, 'Erreur:', userError);

        if (userError) {
          throw userError;
        }
        
        // On met à jour le profil
        setProfile(userData);
      } catch (err) {
        console.error('Erreur lors de la récupération du profil :', err);
        setError(err.message || 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction d'update du profil (utilisée par PersonalInfoForm & AvatarUpload)
  const updateProfile = async (updates) => {
    if (!profile) return { success: false };
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();
    
      if (error) {
        console.error('Erreur update profile:', error);
        return { success: false };
      }

      // Mise à jour de l'état local
      setProfile(data);
      return { success: true };
    } catch (err) {
      console.error('Erreur update profile:', err);
      return { success: false };
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">Erreur : {error}</div>;
  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">Aucun profil trouvé pour cet utilisateur.</div>;
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow w-full px-4 sm:px-8 md:px-12 lg:px-24 py-8 lg:py-12">
        {/* Content container with max-width */}
        <div className="max-w-[1800px] mx-auto">
          {/* Header commun (logo + menu) */}
          <ProfileHeader />

          {/* Conteneur principal en 2 colonnes, avec un léger espace */}
          <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full gap-6 mt-8 mb-8">
            {/* Colonne de gauche (menu) - ajustement pour mobile */}
            <div className="md:w-1/4 w-full bg-[#e9d9ff] rounded-lg shadow-lg p-6 flex-shrink-0">
              <ul className="space-y-4 text-sm sm:text-base md:text-lg">
                <li
                  className={`cursor-pointer px-4 py-2 rounded-md hover:bg-[#d7c3ff] transition-colors ${
                    selectedCategory === 'informations'
                      ? 'bg-[#d7c3ff] font-bold text-[#9557fa]'
                      : 'text-gray-800'
                  }`}
                  onClick={() => setSelectedCategory('informations')}
                >
                  Informations
                </li>
                <li
                  className={`cursor-pointer px-4 py-2 rounded-md hover:bg-[#d7c3ff] transition-colors ${
                    selectedCategory === 'preferences'
                      ? 'bg-[#d7c3ff] font-bold text-[#9557fa]'
                      : 'text-gray-800'
                  }`}
                  onClick={() => setSelectedCategory('preferences')}
                >
                  Préférences de voyages
                </li>
                <li
                  className={`cursor-pointer px-4 py-2 rounded-md hover:bg-[#d7c3ff] transition-colors ${
                    selectedCategory === 'delete'
                      ? 'bg-[#d7c3ff] font-bold text-[#9557fa]'
                      : 'text-gray-800'
                  }`}
                  onClick={() => setSelectedCategory('delete')}
                >
                  Supprimer
                </li>
              </ul>
            </div>

            {/* Colonne de droite (contenu), avec le même type de relief */}
            <div className="md:w-3/4 w-full bg-white rounded-lg shadow-lg p-6 flex-grow">
              {selectedCategory === 'informations' && (
                <div className="space-y-8">
                  <PersonalInfoForm 
                    userProfile={profile} 
                    updateProfile={updateProfile} 
                  />
                  <AvatarUpload 
                    userProfile={profile} 
                    updateProfile={updateProfile} 
                  />
                </div>
              )}

              {selectedCategory === 'preferences' && (
                <div className="space-y-8">
                  <TravelPreferences userProfile={profile} />
                </div>
              )}

              {selectedCategory === 'delete' && (
                <DeleteAccount userId={profile?.id} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UserProfil;