import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

import Header from '../components/UserProfile/ProfileHeader';
import PersonalInfoForm from '../components/UserProfile/PersonnalInforForm';
import AvatarUpload from '../components/UserProfile/AvatarUpload';
import DeleteAccount from '../components/UserProfile/DeleteAccount';

function UserProfil() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pour gérer l’onglet actif dans la colonne de gauche
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

  // Fonction d’update du profil (utilisée par PersonalInfoForm & AvatarUpload)
  const updateProfile = async (updates) => {
    if (!profile) return { success: false };
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', profile.id)
        .single();

      if (error) {
        console.error('Erreur update profile:', error);
        return { success: false };
      }

      // Mise à jour de l’état local
      setProfile(data);
      return { success: true };
    } catch (err) {
      console.error('Erreur update profile:', err);
      return { success: false };
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-grow w-full px-4 sm:px-8 md:px-12 lg:px-24 py-8 lg:py-12">
        <div className="max-w-[1800px] mx-auto">
      <Header/>

      {/* Contenu principal : 2 colonnes */}
      <div className="flex flex-grow max-w-7xl mx-auto w-full">
        {/* Colonne de gauche (menu) */}
        <div className="w-1/4 p-6 bg-[#e9d9ff] rounded-l-lg shadow-lg">
          <ul className="space-y-4 text-lg">
            <li
              className={`cursor-pointer px-4 py-2 rounded-md hover:bg-[#d7c3ff] transition-colors ${
                selectedCategory === 'informations' 
                ? 'bg-[#d7c3ff] font-bold text-[#9557fa]' 
                : 'text-gray-800'}
                `}
              onClick={() => setSelectedCategory('informations')}
            >
              Informations
            </li>
            <li
              className={`cursor-pointer px-4 py-2 rounded-md hover:bg-[#d7c3ff] transition-colors ${
                selectedCategory === 'preferences' 
                ? 'bg-[#d7c3ff] font-bold text-[#9557fa]' 
                : 'text-gray-800'}
                `}
              onClick={() => setSelectedCategory('preferences')}
            >
              Préférences de voyages
            </li>
            <li
              className={`cursor-pointer px-4 py-2 rounded-md hover:bg-[#d7c3ff] transition-colors ${
                selectedCategory === 'delete' 
                ? 'bg-[#d7c3ff] font-bold text-[#9557fa]' 
                : 'text-gray-800'}
                `}
              onClick={() => setSelectedCategory('delete')}
            >
              Supprimer
            </li>
          </ul>
        </div>

        {/* Colonne de droite (contenu) */}
        <div className="w-3/4 p-4">
          {/* Onglet Informations */}
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

          {/* Onglet Préférences (pour l’instant vide) */}
          {selectedCategory === 'preferences' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Préférences de voyages</h2>
              <p>Pour le moment, cette section n'est pas encore implémentée.</p>
            </div>
          )}

          {/* Onglet Supprimer */}
          {selectedCategory === 'delete' && (
            <DeleteAccount userId={profile.id} />
          )}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default UserProfil;
