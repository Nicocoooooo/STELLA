import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Logo from '../assets/images/Logo.png';
import BackgroundImage from '../assets/images/golden_gate.png';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checked) {
      navigate('/signup2');
    } else {
      alert("Veuillez accepter la politique de confidentialité.");
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Section Gauche */}
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
      
      {/* Section Droite */}
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
