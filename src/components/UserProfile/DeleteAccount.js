import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';

function DeleteAccount({ userId }) {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      // 1) Supprimer l’utilisateur dans la table `users`
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      // 2) Déconnecter l’utilisateur (si tu utilises Supabase Auth)
      await supabase.auth.signOut();

      // 3) Afficher un message ou rediriger
      setMessage('Compte supprimé avec succès.');
      // Exemple : redirection
       navigate('/'); // ou window.location.href = '/';
    } catch (err) {
      console.error('Erreur suppression compte:', err);
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Cas où on n’a pas de userId
  if (!userId) {
    return <div>Aucun utilisateur n’est connecté.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#9557fa]">Supprimer mon compte</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded">
          {message}
        </div>
      )}

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Supprimer mon compte
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
            irréversible.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-70"
            >
              {loading ? 'Suppression...' : 'Confirmer'}
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccount;
