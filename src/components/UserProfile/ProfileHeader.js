import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/Logo.png';

function ProfileHeader({ userProfile, activeTab, setActiveTab }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <Link to="/">
        <img src={Logo} alt="Stella" className="w-24 mb-4 md:mb-0" />
      </Link>
      
      <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Mon Profil</h1>
      
      <div className="flex space-x-2">
        <button 
          onClick={() => setActiveTab('personal')} 
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'personal' ? 'bg-[#9557fa] text-white' : 'bg-white text-gray-700'}`}
        >
          Informations
        </button>
        <button 
          onClick={() => setActiveTab('avatar')} 
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'avatar' ? 'bg-[#9557fa] text-white' : 'bg-white text-gray-700'}`}
        >
          Photo
        </button>
        <button 
          onClick={() => setActiveTab('preferences')} 
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'preferences' ? 'bg-[#9557fa] text-white' : 'bg-white text-gray-700'}`}
        >
          Préférences
        </button>
        <button 
          onClick={() => setActiveTab('delete')} 
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'delete' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;