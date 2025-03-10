import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem('userId');
  
  // Vérification immédiate du userId
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  
  // Rendu des enfants si l'utilisateur est connecté
  return children;
}

export default ProtectedRoute;