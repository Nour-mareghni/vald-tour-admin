// Import des hooks React et des dépendances Firebase et Router
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

// Composant PrivateRoute (Route privée)
// Ce composant protège les routes enfants en vérifiant l'authentification
export default function PrivateRoute({ children }) {
  // État pour stocker l'utilisateur connecté
  const [user, setUser] = useState(null);
  // État pour gérer le chargement pendant la vérification d'authentification
  const [loading, setLoading] = useState(true);

  // Effet pour s'abonner aux changements d'état d'authentification
  useEffect(() => {
    // Abonnement à l'observable d'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Met à jour l'état user
      setLoading(false); // Indique que le chargement est terminé
    });

    // Nettoyage : désabonnement lors du démontage du composant
    return () => unsubscribe();
  }, []); // Tableau de dépendances vide = exécution uniquement au montage

  // Pendant le chargement, affiche un indicateur
  if (loading) return <div>Chargement...</div>;

  // Si utilisateur connecté, affiche le Dashboard
  // Sinon, redirige vers la page de connexion
  return user ? children : <Navigate to="/login" />;
}