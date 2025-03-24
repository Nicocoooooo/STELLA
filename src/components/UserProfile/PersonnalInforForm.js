import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import FlagFR from '../../assets/images/flag_fr.png';
import FlagUS from '../../assets/images/flag_us.png';
import FlagES from '../../assets/images/flag_es.png';

function PersonalInfoForm({ userProfile, updateProfile }) {
  const [formData, setFormData] = useState({
    nom: userProfile.last_name || '',
    prenom: userProfile.first_name || '',
    civilite: userProfile.civilite || '',
    nationalite: userProfile.nationality || '',
    telephone: userProfile.phone_number || '',
    dateNaissance: userProfile.birth_date || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Association nationalités -> Drapeaux
  const drapeaux = {
    FR: FlagFR,
    US: FlagUS,
    ES: FlagES,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        civilite: formData.civilite,
        nationality: formData.nationalite,
        first_name: formData.prenom,
        last_name: formData.nom,
        full_name: `${formData.prenom} ${formData.nom}`,
        phone_number: formData.telephone,
        birth_date: formData.dateNaissance,
        updated_at: new Date().toISOString()
      };

      const result = await updateProfile(updateData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      } else {
        throw new Error('Échec de la mise à jour');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#9557fa] mb-6">Informations personnelles</h2>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        
        {/* Civilité */}
        <div>
          <label className="block text-gray-700 mb-2">Civilité</label>
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
          <label className="block text-gray-700 mb-2">Nationalité</label>
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
          <label className="block text-gray-700 mb-2">Nom</label>
          <input 
            type="text" 
            name="nom" 
            placeholder="Votre nom" 
            value={formData.nom} 
            onChange={handleChange} 
            className="w-full bg-[#e9d9ff] rounded-lg py-3 px-4 text-gray-800 outline-none" 
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Prénom</label>
          <input 
            type="text" 
            name="prenom" 
            placeholder="Votre prénom" 
            value={formData.prenom} 
            onChange={handleChange} 
            className="w-full bg-[#e9d9ff] rounded-lg py-3 px-4 text-gray-800 outline-none" 
          />
        </div>

        {/* Téléphone et Date de naissance */}
        <div>
          <label className="block text-gray-700 mb-2">Numéro de téléphone</label>
          <div className="relative">
            <img 
              src={drapeaux[formData.nationalite] || FlagUS} 
              alt="Drapeau" 
              className="absolute left-4 top-3 w-6" 
            />
            <input 
              type="tel" 
              name="telephone" 
              placeholder="Votre numéro" 
              value={formData.telephone} 
              onChange={handleChange} 
              className="w-full bg-[#e9d9ff] rounded-lg py-3 pl-14 pr-4 text-gray-800 outline-none" 
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Date de Naissance</label>
          <input 
            type="date" 
            name="dateNaissance" 
            value={formData.dateNaissance} 
            onChange={handleChange} 
            className="w-full bg-[#e9d9ff] rounded-lg py-3 px-4 text-gray-800 outline-none" 
          />
        </div>

        {/* Bouton de soumission */}
        <button 
          type="submit" 
          disabled={loading}
          className="md:col-span-2 w-full py-3 mt-6 text-white font-semibold rounded-lg bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] hover:opacity-90 disabled:opacity-70"
        >
          {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}

export default PersonalInfoForm;