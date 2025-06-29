import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";

// Composant pour la page de connexion administrateur
export default function Login() {
  // États pour stocker l'email, le mot de passe et les erreurs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fonction pour gérer la connexion
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // Tentative de connexion avec Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirection vers le tableau de bord après connexion
    } catch (err) {
      setError("Email ou mot de passe invalide"); // Gestion des erreurs
    }
  };

  // Rendu du composant
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, p: 3 }}>
      {/* Titre de la page */}
      <Typography variant="h4" gutterBottom>
        Connexion Admin
      </Typography>
      
      {/* Affichage des erreurs si elles existent */}
      {error && <Typography color="error">{error}</Typography>}
      
      {/* Formulaire de connexion */}
      <form onSubmit={handleLogin}>
        {/* Champ pour l'email */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        {/* Champ pour le mot de passe */}
        <TextField
          label="Mot de passe"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Bouton de soumission */}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Se connecter
        </Button>
      </form>
    </Box>
  );
}