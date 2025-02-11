import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis.';
    if (!formData.email.includes('@')) newErrors.email = 'Email invalide.';
    if (formData.password.length < 6) newErrors.password = 'Mot de passe trop court (min. 6 caractères).';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Inscription réussie !', formData);
      setSuccessMessage('Inscription réussie ! Redirection...');
      setTimeout(() => {
        // Redirection ici (ex: navigate('/login'))
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Inscription</h2>
        
        {successMessage && <p className="text-green-600 text-center mt-2">{successMessage}</p>}
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Nom</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" />
            {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Mot de passe</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Confirmer le mot de passe</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="w-full bg-[#fa9b3d] text-white py-2 rounded-lg hover:bg-[#fa9b3d]/90 transition">
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ? <Link to="/login" className="text-[#9557fa] hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;