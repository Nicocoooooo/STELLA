import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import Logo from '../assets/images/Logo.png';
import BackgroundImage from '../assets/images/newyorkcity.jpg';

function SignUp3() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const fetchEmail = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('email')
          .eq('id', userId)
          .single();
        
        if (!error && data) {
          setEmail(data.email);
        }
      };
      fetchEmail();
    }
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url(${BackgroundImage})` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Logo en haut à gauche */}
      <img src={Logo} alt="Stella" className="absolute top-6 left-6 w-28" />
      
      {/* Boîte de confirmation */}
      <div className="bg-white p-8 rounded-lg shadow-lg z-10 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[#9557fa] flex items-center justify-center">
          <span className="mr-2">✨</span> Félicitations !
        </h2>
        <p className="mt-4 text-gray-700">Votre compte Stella est maintenant actif.</p>
        <p className="mt-2 text-gray-700">Un email de confirmation a été envoyé à :</p>
        <p className="text-[#fa9b3d] font-semibold">{email || 'Chargement...'}</p>
        
        <Link
          to="/"
          className="mt-6 inline-block bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white font-semibold py-3 px-6 rounded-lg transition-all hover:opacity-90"
        >
          Découvrir des destinations
        </Link>
      </div>
    </div>
  );
}

export default SignUp3;
