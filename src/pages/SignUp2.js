import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import supabase from '../supabaseClient';
import Logo from '../assets/images/Logo.png';
import BackgroundImage from '../assets/images/mountain_background.png';

// Importation des drapeaux
import FlagFR from '../assets/images/flag_fr.png';
import FlagUS from '../assets/images/flag_us.png';
import FlagES from '../assets/images/flag_es.png';

// Import du CSS
import '../styles/SignUp2.css';

function SignUp2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    civilite: '',
    nationalite: '',
    nom: '',
    prenom: '',
    telephone: '',
    dateNaissance: '',
  });

  const [checked, setChecked] = useState(false);

  // Association nationalités -> Drapeaux
  const drapeaux = {
    FR: FlagFR,
    US: FlagUS,
    ES: FlagES,
  };

  // Changer le champ en fonction de l'entrée
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("❌ Aucun utilisateur connecté, redirection vers l'inscription.");
      navigate('/signup');
      return;
    }

    console.log("📝 Mise à jour des informations utilisateur...");

    const { error } = await supabase
      .from('users')
      .update({
        full_name: `${formData.prenom} ${formData.nom}`,
        first_name: formData.prenom,
        last_name: formData.nom,
        phone_number: formData.telephone,
        nationality: formData.nationalite,
        birth_date: formData.dateNaissance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error("❌ Erreur lors de la mise à jour de l'utilisateur:", error);
    } else {
      console.log("✅ Informations mises à jour avec succès !");
      navigate('/signup3');
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${BackgroundImage})` }}>
      {/* Logo cliquable qui redirige vers la home */}
      <Link to="/" className="absolute top-6 left-8">
        <img src={Logo} alt="Stella" className="w-24 cursor-pointer" />
      </Link>

      {/* Formulaire principal */}
      <div className="bg-white px-12 py-10 rounded-3xl shadow-lg max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-[#9557fa] text-center">Apprenons à mieux vous connaître ✨</h2>

        {/* Formulaire */}
        <form className="mt-6 grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Civilité */}
          <div>
            <label className="block text-gray-700">Civilité (M./Mme)</label>
            <div className="relative">
              <select
                name="civilite"
                value={formData.civilite}
                onChange={handleChange}
                className="w-full bg-[#e9d9ff] rounded-lg py-3 px-4 text-gray-800 outline-none appearance-none"
              >
                <option value="">Sélectionner</option>
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
              </select>
              <FaChevronDown className="absolute right-4 top-4 text-gray-600" />
            </div>
          </div>

          {/* Nationalité */}
          <div>
            <label className="block text-gray-700">Nationalité</label>
            <div className="relative">
              <select
                name="nationalite"
                value={formData.nationalite}
                onChange={handleChange}
                className="w-full bg-[#e9d9ff] rounded-lg py-3 px-4 text-gray-800 outline-none appearance-none"
              >
                <option value="">Sélectionner</option>
                <option value="FR">Français</option>
                <option value="US">Américain</option>
                <option value="ES">Espagnol</option>
              </select>
              <FaChevronDown className="absolute right-4 top-4 text-gray-600" />
            </div>
          </div>

          {/* Nom et Prénom */}
          <div>
            <label className="block text-gray-700">Nom</label>
            <input type="text" name="nom" placeholder="Votre nom" value={formData.nom} onChange={handleChange} className="w-full bg-[#e9d9ff] rounded-lg py-3 px-4 text-gray-800 outline-none" />
          </div>
          <div>
            <label className="block text-gray-700">Prénom</label>
            <input type="text" name="prenom" placeholder="Votre prénom" value={formData.prenom} onChange={handleChange} className="w-full bg-[#e9d9ff] rounded-lg py-3 px-4 text-gray-800 outline-none" />
          </div>

          {/* Téléphone et Date de naissance */}
          <div>
            <label className="block text-gray-700">Numéro de téléphone</label>
            <div className="relative">
              <img src={drapeaux[formData.nationalite] || FlagUS} alt="Drapeau" className="absolute left-4 top-3 w-6" />
              <input type="tel" name="telephone" placeholder="Votre numéro" value={formData.telephone} onChange={handleChange} className="w-full bg-[#e9d9ff] rounded-lg py-3 pl-14 pr-4 text-gray-800 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Date de Naissance</label>
            <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full bg-[#e9d9ff] rounded-lg py-3 px-4 text-gray-800 outline-none" />
          </div>

          {/* Bouton de soumission */}
          <button type="submit" className="col-span-2 w-full py-3 mt-6 text-white font-semibold rounded-lg bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] hover:opacity-90">
            S’inscrire →
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp2;
