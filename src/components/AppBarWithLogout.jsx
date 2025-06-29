// Import des composants Material-UI, des fonctions Firebase et du router
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

// Définition du composant AppBarWithLogout (Barre d'application avec bouton de déconnexion)
export default function AppBarWithLogout() {
  // Hook pour la navigation programmatique
  const navigate = useNavigate();

  // Fonction de gestion de la déconnexion
  const handleLogout = async () => {
    // Déconnexion via Firebase Auth
    await signOut(auth);
    // Redirection vers la page de connexion après déconnexion
    navigate('/login');
  };

  // Rendu du composant
  return (
    // Barre d'application Material-UI
    <AppBar position="static">
      <Toolbar>
        {/* Titre à gauche avec flex grow pour occuper l'espace disponible */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Tour Admin
        </Typography>
        {/* Bouton de déconnexion à droite */}
        <Button color="inherit" onClick={handleLogout}>
          Déconnexion
        </Button>
      </Toolbar>
    </AppBar>
  );
}