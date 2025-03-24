import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Logo from '../assets/images/Logo.png';
import BackgroundImage from '../assets/images/mountain_background.png';
import ProfileHeader from '../components/UserProfile/ProfileHeader';
import PersonalInfoForm from '../components/UserProfile/PersonalInfoForm';
import AvatarUpload from '../components/UserProfile/AvatarUpload';
import TravelPreferences from '../components/UserProfile/TravelPreferences';
import DeleteAccount from '../components/UserProfile/DeleteAccount';
import '../styles/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
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

    const fetchUserProfile = async () => { 
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            avatar_url,
            points,
            first_name,
            last_name,
            birth_date,
            phone_number,
            nationality,
            email
            `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setUserProfile(data);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const updateProfile = async (newData) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(newData)
        .eq('id', userProfile.id);

      if (error) throw error;
      
      setUserProfile({...userProfile, ...newData});
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { success: false, error };
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${BackgroundImage})` }}>
      {/* En-tête avec logo et navigation */}
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader 
          userProfile={userProfile} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
        
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
          {activeTab === 'personal' && (
            <PersonalInfoForm 
              userProfile={userProfile} 
              updateProfile={updateProfile} 
            />
          )}
          
          {activeTab === 'avatar' && (
            <AvatarUpload 
              userProfile={userProfile} 
              updateProfile={updateProfile} 
            />
          )}
          
          {activeTab === 'preferences' && (
            <TravelPreferences 
              userProfile={userProfile} 
              updateProfile={updateProfile} 
            />
          )}
          
          {activeTab === 'delete' && (
            <DeleteAccount 
              userProfile={userProfile} 
              navigate={navigate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;