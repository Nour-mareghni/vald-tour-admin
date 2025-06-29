// Import des dépendances React et Material-UI
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Divider,
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

// Définition des champs standards du formulaire
const CHAMPS_STANDARDS = [
  { name: 'name', label: 'Nom du tournoi', type: 'text', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'city', label: 'Ville', type: 'text', required: true },
  { name: 'country', label: 'Pays', type: 'text', required: true },
  { name: 'venue', label: 'Lieu', type: 'text', required: true },
  { name: 'entryFee', label: 'Prix d\'entrée', type: 'number', required: false },
  { 
    name: 'status', 
    label: 'Statut', 
    type: 'select',
    options: ['upcoming', 'ongoing', 'completed'], // Options pour le menu déroulant
    required: true 
  }
];

// Composant principal FormulaireTournoi
export default function FormulaireTournoi({ open, onClose, onSubmit, initialData }) {
  // État pour stocker les données du formulaire
  const [donneesFormulaire, setDonneesFormulaire] = useState(
    CHAMPS_STANDARDS.reduce((acc, champ) => ({
      ...acc,
      [champ.name]: champ.type === 'number' ? 0 : '' // Initialisation des valeurs par défaut
    }), {})
  );

  // Effet pour initialiser ou réinitialiser le formulaire
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Si initialData existe, on l'utilise pour pré-remplir le formulaire (mode édition)
      setDonneesFormulaire(initialData);
    } else {
      // Sinon, on initialise avec des valeurs vides (mode création)
      setDonneesFormulaire(
        CHAMPS_STANDARDS.reduce((acc, champ) => ({
          ...acc,
          [champ.name]: champ.type === 'number' ? 0 : ''
        }), {})
      );
    }
  }, [initialData, open]); // Déclenché quand initialData ou open change

  // Gestion de la soumission du formulaire
  const handleSoumettre = (e) => {
    e.preventDefault();
    onSubmit(donneesFormulaire); // Appel de la fonction onSubmit passée en prop
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* En-tête du dialogue avec titre conditionnel et bouton de fermeture */}
      <DialogTitle>
        {initialData?.id ? 'Modifier le tournoi' : 'Créer un nouveau tournoi'}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      {/* Contenu principal du formulaire */}
      <DialogContent dividers>
        <form onSubmit={handleSoumettre}>
          <Stack spacing={3}>
            <Typography variant="h6">Champs standards</Typography>
            
            {/* Boucle sur les champs standards pour générer les inputs */}
            {CHAMPS_STANDARDS.map((champ) => (
              champ.type === 'select' ? (
                // Cas particulier pour les menus déroulants
                <TextField
                  key={champ.name}
                  select
                  label={champ.label}
                  value={donneesFormulaire[champ.name] || ''}
                  onChange={(e) => setDonneesFormulaire({
                    ...donneesFormulaire, 
                    [champ.name]: e.target.value
                  })}
                  required={champ.required}
                  fullWidth
                  margin="normal"
                >
                  {champ.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                // Cas standard pour les autres types de champs
                <TextField
                  key={champ.name}
                  label={champ.label}
                  type={champ.type}
                  InputLabelProps={champ.type === 'date' ? { shrink: true } : {}}
                  value={champ.type === 'date' && donneesFormulaire[champ.name] 
                    ? donneesFormulaire[champ.name].split('T')[0] // Formatage de la date
                    : donneesFormulaire[champ.name] || ''}
                  onChange={(e) => setDonneesFormulaire({
                    ...donneesFormulaire, 
                    [champ.name]: champ.type === 'number' 
                      ? Number(e.target.value) // Conversion en nombre pour les champs numériques
                      : e.target.value
                  })}
                  required={champ.required}
                  fullWidth
                  margin="normal"
                />
              )
            ))}
          </Stack>
        </form>
      </DialogContent>

      {/* Actions en bas du dialogue */}
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSoumettre} 
          variant="contained"
          type="submit"
        >
          {initialData?.id ? 'Mettre à jour' : 'Créer'} // Texte conditionnel du bouton
        </Button>
      </DialogActions>
    </Dialog>
  );
}