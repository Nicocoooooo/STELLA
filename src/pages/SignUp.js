import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import supabase from '../supabaseClient';
import Logo from '../assets/images/Logo.png';
import BackgroundImage from '../assets/images/golden_gate.png';
import bcrypt from 'bcryptjs';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log("Utilisateur connecté, ID:", userId);
    } else {
      console.log("Aucun utilisateur connecté.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    console.log("🔍 Vérification de l'email dans la base de données...");
    
    // Vérification si l'email existe déjà
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("❌ Erreur lors de la vérification de l'utilisateur:", fetchError);
      return;
    }
    
    if (existingUser) {
      console.log("🔄 L'email existe déjà, redirection vers la page de connexion...");
      navigate('/login');
    } else {
      console.log("✅ L'email n'existe pas, création d'un nouvel utilisateur...");
      
      // Hachage du mot de passe avant l'insertion
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      console.log("🔐 Mot de passe hashé:", hashedPassword);
      
      // Créer l'utilisateur dans Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error("❌ Erreur lors de l'inscription:", error);
      } else {
        console.log("🎉 Utilisateur ajouté à `auth.users`, maintenant on l'insère dans `users`...");

        // Insérer l'utilisateur dans `users`
        await supabase.from('users').insert([
          {
            id: data.user.id,
            email,
            password_hash: hashedPassword,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            full_name: null,
            avatar_url: null,
            points: 0,
            first_name: null,
            last_name: null,
            birth_date: null,
            phone_number: null,
            nationality: null,
            role: 'user'
          }
        ]);

        // Stocker l'ID utilisateur dans le localStorage
        localStorage.setItem("userId", data.user.id);
        console.log("🔐 ID utilisateur stocké :", data.user.id);
        
        navigate('/signup2');
      }
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 bg-white relative">
        <Link to="/" className="absolute top-6 left-8"><img src={Logo} alt="Stella" className="w-28" /></Link>
        <h2 className="text-3xl font-bold text-[#9557fa] mt-12">Inscription</h2>
        <p className="mt-2 text-lg text-gray-700 text-center">✈️ Prêt à planifier votre prochain voyage ?</p>
        
        <form className="mt-6 w-full max-w-md space-y-5" onSubmit={handleSubmit}>
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
          
          <Link to="/login" className="text-[#9557fa] text-sm text-center block hover:underline">
            J’ai déjà un compte - Je me connecte
          </Link>
          
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="accept"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="w-5 h-5 border-gray-300 text-[#9557fa] rounded focus:ring-0"
            />
            <label htmlFor="accept" className="text-sm text-gray-600">
              En m'inscrivant, j’accepte de recevoir les actualités par email et confirme avoir lu la politique de confidentialité.*
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-lg transition-all bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] hover:opacity-90"
          >
            S’inscrire →
          </button>
        </form>
      </div>
      
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src={BackgroundImage}
          alt="Golden Gate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <h3 className="absolute inset-0 flex items-center justify-start pl-10 text-white text-3xl font-bold text-left">
          Vivez des expériences uniques
        </h3>
      </div>
    </div>
  );
}

export default SignUp;
