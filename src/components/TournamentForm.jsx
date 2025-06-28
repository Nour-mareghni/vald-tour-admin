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
    options: ['upcoming', 'ongoing', 'completed'],
    required: true 
  }
];

export default function FormulaireTournoi({ open, onClose, onSubmit, initialData }) {
  const [donneesFormulaire, setDonneesFormulaire] = useState(
    CHAMPS_STANDARDS.reduce((acc, champ) => ({
      ...acc,
      [champ.name]: champ.type === 'number' ? 0 : ''
    }), {})
  );

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

  const handleSoumettre = (e) => {
    e.preventDefault();
    onSubmit(donneesFormulaire);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
      
      <DialogContent dividers>
        <form onSubmit={handleSoumettre}>
          <Stack spacing={3}>
            <Typography variant="h6">Champs standards</Typography>
            
            {CHAMPS_STANDARDS.map((champ) => (
              champ.type === 'select' ? (
                <TextField
                  key={champ.name}
                  select
                  label={champ.label}
                  value={donneesFormulaire[champ.name] || ''}
                  onChange={(e) => setDonneesFormulaire({...donneesFormulaire, [champ.name]: e.target.value})}
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
                    [champ.name]: champ.type === 'number' ? Number(e.target.value) : e.target.value
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