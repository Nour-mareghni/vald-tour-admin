// Import des dépendances nécessaires
import { Button } from '@mui/material';  // Composant Button de Material-UI
import { signOut } from 'firebase/auth'; // Fonction de déconnexion de Firebase
import { auth } from '../firebase';      // Configuration Firebase
import { useNavigate } from 'react-router-dom'; // Hook pour la navigation

// Composant LogoutButton (Bouton de déconnexion)
export default function LogoutButton() {
  // Initialisation du hook de navigation
  const navigate = useNavigate();

  // Fonction asynchrone pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      // Tentative de déconnexion via Firebase Auth
      await signOut(auth);
      // Redirection vers la page de login après déconnexion
      navigate('/login');
    } catch (error) {
      // Gestion des erreurs éventuelles
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Rendu du composant
  return (
    <Button 
      color="error"            // Couleur rouge pour indiquer une action critique
      variant="contained"     // Style "rempli" du bouton
      onClick={handleLogout}   // Gestionnaire d'événement au clic
      sx={{
        position: 'absolute', // Position absolue pour le placement
        top: 16,             // 16px du haut
        left: 16,            // 16px de la gauche
        zIndex: 1000         // Garantit que le bouton est au-dessus des autres éléments
      }}
    >
      Déconnexion            // Texte du bouton (traduit en français)
    </Button>
  );
}