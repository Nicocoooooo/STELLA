import React, { useState } from 'react';
import { FaCamera, FaTrash } from 'react-icons/fa';
import supabase from '../../supabaseClient';

function AvatarUpload({ userProfile, updateProfile }) {
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      setMessage({ type: '', text: '' });

      const file = e.target.files[0];
      if (!file) return;

      // Générer un chemin : "<UUID>/<nom_aléatoire>.<ext>"
      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile.id}_${Math.random()}.${fileExt}`;
      const filePath = `${userProfile.id}/${fileName}`;

      // 1) Upload du fichier dans le bucket "avatars"
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2) Créer une URL signée temporaire (60 sec)
      const { data } = await supabase.storage
        .from('avatars')
        .createSignedUrl(filePath, 60);

      // On récupère l'URL signée (ou vide si échec)
      const signedUrl = data?.signedUrl || '';

      // 3) Mettre à jour le profil utilisateur
      const result = await updateProfile({
        avatar_url: signedUrl,
        updated_at: new Date().toISOString(),
      });

      if (result.success) {
        setAvatarUrl(signedUrl);
        setMessage({
          type: 'success',
          text: 'Photo de profil mise à jour avec succès !',
        });
      } else {
        throw new Error('Échec de la mise à jour');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erreur lors du téléchargement de l\'image.',
      });
      console.error('Erreur:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setUploading(true);
      setMessage({ type: '', text: '' });

      // Si aucune URL, rien à supprimer
      if (!avatarUrl) return;

      // Extraire le chemin après "avatars/"
      // Ex : ".../avatars/e8291748-f667-.../fichier.jpg"
      // => pathMatch[1] = "e8291748-f667-.../fichier.jpg"
      const pathMatch = avatarUrl.match(/avatars\/(.+)/);
      if (pathMatch && pathMatch[1]) {
        // 1) Supprimer le fichier
        await supabase.storage
          .from('avatars')
          .remove([pathMatch[1]]);
      }

      // 2) Mettre à jour le profil (retirer l'avatar_url)
      const result = await updateProfile({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      });

      if (result.success) {
        setAvatarUrl('');
        setMessage({
          type: 'success',
          text: 'Photo de profil supprimée avec succès !',
        });
      } else {
        throw new Error('Échec de la suppression');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erreur lors de la suppression de l\'image.',
      });
      console.error('Erreur:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#9557fa] mb-6">Photo de profil</h2>

      {message.text && (
        <div
          className={`p-4 mb-6 w-full max-w-md rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="relative w-48 h-48 mb-8">
        <div className="w-full h-full rounded-full overflow-hidden bg-[#e9d9ff] flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl text-[#9557fa] font-bold">
              {userProfile.first_name
                ? userProfile.first_name.charAt(0).toUpperCase()
                : '?'}
            </div>
          )}
        </div>

        <label className="absolute bottom-2 right-2 w-12 h-12 bg-[#9557fa] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#7a3de0] transition-colors">
          <FaCamera className="text-white text-xl" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {avatarUrl && (
        <button
          onClick={handleDeleteAvatar}
          disabled={uploading}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-70"
        >
          <FaTrash className="mr-2" /> Supprimer la photo
        </button>
      )}
    </div>
  );
}

export default AvatarUpload;
