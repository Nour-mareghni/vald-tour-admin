import { useState } from 'react';
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
    options: ['à venir', 'en cours', 'terminé'],
    required: true 
  }
];

export default function FormulaireTournoi({ open, onClose, onSubmit }) {
  const [donneesFormulaire, setDonneesFormulaire] = useState(
    CHAMPS_STANDARDS.reduce((acc, champ) => ({
      ...acc,
      [champ.name]: champ.type === 'number' ? 0 : ''
    }), {})
  );

  const [champsPersonnalises, setChampsPersonnalises] = useState([]);
  const [nouveauChamp, setNouveauChamp] = useState({ 
    name: '', 
    type: 'text' 
  });

  const handleSoumettre = (e) => {
    e.preventDefault();
    onSubmit(donneesFormulaire);
    onClose();
  };

  const ajouterChamp = () => {
    if (!nouveauChamp.name) return;
    
    setChampsPersonnalises([...champsPersonnalises, nouveauChamp]);
    setDonneesFormulaire({
      ...donneesFormulaire,
      [nouveauChamp.name]: nouveauChamp.type === 'number' ? 0 : ''
    });
    setNouveauChamp({ name: '', type: 'text' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Créer un nouveau tournoi
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
                  value={donneesFormulaire[champ.name] || ''}
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

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Champs personnalisés</Typography>
            
            {champsPersonnalises.map((champ) => (
              <TextField
                key={champ.name}
                label={champ.name}
                type={champ.type}
                value={donneesFormulaire[champ.name] || ''}
                onChange={(e) => setDonneesFormulaire({
                  ...donneesFormulaire, 
                  [champ.name]: champ.type === 'number' ? Number(e.target.value) : e.target.value
                })}
                fullWidth
                margin="normal"
              />
            ))}

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Nom du champ"
                value={nouveauChamp.name}
                onChange={(e) => setNouveauChamp({...nouveauChamp, name: e.target.value})}
                size="small"
                fullWidth
              />
              <TextField
                select
                label="Type"
                value={nouveauChamp.type}
                onChange={(e) => setNouveauChamp({...nouveauChamp, type: e.target.value})}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="text">Texte</MenuItem>
                <MenuItem value="number">Nombre</MenuItem>
                <MenuItem value="boolean">Oui/Non</MenuItem>
              </TextField>
              <Button 
                onClick={ajouterChamp} 
                variant="outlined"
                disabled={!nouveauChamp.name}
              >
                Ajouter
              </Button>
            </Stack>
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
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
}