import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Logo from '../assets/images/Logo.png';
import BackgroundImage from '../assets/images/golden_gate.png'; // Remplace par l'image réelle

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen">
      {/* Section Gauche - Formulaire */}
      <div className="w-1/2 flex flex-col justify-center px-16 bg-white">
        {/* Logo */}
        <img src={Logo} alt="Stella" className="w-24 mb-6" />

        <h2 className="text-3xl font-bold text-[#9557fa]">Inscription</h2>
        <p className="mt-2 text-lg text-gray-700">✈️ Prêt à planifier votre prochain voyage ?</p>

        {/* Formulaire */}
        <form className="mt-6 space-y-5">
          {/* Champ Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Votre adresse email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-[#e9d9ff] rounded-lg text-gray-800 placeholder-gray-700 outline-none"
            />
          </div>

          {/* Champ Mot de Passe */}
          <div className="relative">
            <FaLock className="absolute left-4 top-3 text-gray-500 text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3 bg-[#e9d9ff] rounded-lg text-gray-800 placeholder-gray-700 outline-none"
            />
            <button
              type="button"
              className="absolute right-4 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>

          {/* Lien vers la connexion */}
          <Link to="/login" className="text-[#9557fa] text-sm text-center block hover:underline">
            J’ai déjà un compte - Je me connecte
          </Link>

          {/* Checkbox */}
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

          {/* Bouton d'inscription */}
          <button className="w-full py-3 text-white font-semibold rounded-lg transition-all bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] hover:opacity-90">
            S’inscrire →
          </button>
        </form>
      </div>

      {/* Section Droite - Image */}
      <div className="w-1/2 relative">
        <img
          src={BackgroundImage}
          alt="Golden Gate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <h3 className="absolute bottom-12 left-10 text-white text-3xl font-bold">
          Vivez des expériences <br /> unique
        </h3>
      </div>
    </div>
  );
}

export default SignUp;