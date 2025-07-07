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
  { name: 'artist', label: 'Artiste/Groupe', type: 'text', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'city', label: 'Ville', type: 'text', required: true },
  { name: 'country', label: 'Pays', type: 'text', required: true },
  { name: 'venue', label: 'Lieu', type: 'text', required: true },
  
  { 
    name: 'status', 
    label: 'Statut', 
    type: 'select',
    options: ['upcoming', 'ongoing', 'completed'],
    required: true 
  }
];

// Composant principal FormulaireConcert
export default function FormulaireConcert({ open, onClose, onSubmit, initialData }) {
  // État pour stocker les données du formulaire
  const [donneesFormulaire, setDonneesFormulaire] = useState(
    CHAMPS_STANDARDS.reduce((acc, champ) => ({
      ...acc,
      [champ.name]: champ.type === 'number' ? 0 : ''
    }), {})
  );

  // Effet pour initialiser ou réinitialiser le formulaire
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setDonneesFormulaire(initialData);
    } else {
      setDonneesFormulaire(
        CHAMPS_STANDARDS.reduce((acc, champ) => ({
          ...acc,
          [champ.name]: champ.type === 'number' ? 0 : ''
        }), {})
      );
    }
  }, [initialData, open]);

  // Gestion de la soumission du formulaire
  const handleSoumettre = (e) => {
    e.preventDefault();
    onSubmit(donneesFormulaire);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* En-tête du dialogue avec titre conditionnel et bouton de fermeture */}
      <DialogTitle>
        {initialData?.id ? 'Modifier le concert' : 'Créer un nouveau concert'}
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
            <Typography variant="h6">Informations sur le concert</Typography>
            
            {/* Boucle sur les champs standards pour générer les inputs */}
            {CHAMPS_STANDARDS.map((champ) => (
              champ.type === 'select' ? (
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
                <TextField
                  key={champ.name}
                  label={champ.label}
                  type={champ.type}
                  InputLabelProps={champ.type === 'date' ? { shrink: true } : {}}
                  value={champ.type === 'date' && donneesFormulaire[champ.name] 
                    ? donneesFormulaire[champ.name].split('T')[0]
                    : donneesFormulaire[champ.name] || ''}
                  onChange={(e) => setDonneesFormulaire({
                    ...donneesFormulaire, 
                    [champ.name]: champ.type === 'number' 
                      ? Number(e.target.value)
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
          {initialData?.id ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}