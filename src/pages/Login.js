import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import supabase from '../supabaseClient';
import bcrypt from 'bcryptjs';
import Logo from '../assets/images/Logo.png';
import BackgroundImage from '../assets/images/dubai.jpg';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { email, password } = formData;
    
    console.log("🔍 Vérification des identifiants...");

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, password_hash, phone_number')
      .eq('email', email)
      .single();
    
    if (fetchError) {
      console.error("❌ Erreur lors de la récupération de l'utilisateur:", fetchError);
      setError("Email ou mot de passe incorrect");
      return;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      console.error("❌ Mot de passe incorrect");
      setError("Email ou mot de passe incorrect");
      return;
    }
    
    console.log("✅ Connexion réussie, ID utilisateur:", user.id);
    localStorage.setItem("userId", user.id);

    // ✅ Vérification du numéro de téléphone
    if (!user.phone_number || user.phone_number === null) {
      console.log("📱 Numéro de téléphone manquant, redirection vers SignUp2...");
      navigate('/signup2');
    } else {
      console.log("🏠 Redirection vers le Dashboard...");
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 bg-white relative">
        <Link to="/" className="absolute top-6 left-8"><img src={Logo} alt="Stella" className="w-28" /></Link>
        <h2 className="text-3xl font-bold text-[#9557fa] mt-12">Se Connecter</h2>
        <p className="mt-2 text-lg text-gray-700 text-center">✨ Prêt à continuer l'aventure ?</p>
        <Link to="/signup" className="text-[#9557fa] text-sm text-center block hover:underline mt-2">
          Je n’ai pas encore de compte - Je m’inscris
        </Link>
        
        <form className="mt-6 w-full max-w-md space-y-5" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="relative w-full">
            <FaEnvelope className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Votre adresse email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-[#e9d9ff] rounded-lg text-gray-800 placeholder-gray-700 outline-none"
              required
            />
          </div>
          
          <div className="relative w-full">
            <FaLock className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3 bg-[#e9d9ff] rounded-lg text-gray-800 placeholder-gray-700 outline-none"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-lg transition-all bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] hover:opacity-90"
          >
            Se connecter →
          </button>
        </form>
      </div>
      
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={BackgroundImage}
          alt="Dubai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    </div>
  );
}

export default Login;