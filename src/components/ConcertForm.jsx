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
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

// Updated form fields with only the required ones
const CHAMPS_STANDARDS = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'city', label: 'Ville', type: 'text', required: true },
  { name: 'country', label: 'Pays', type: 'text', required: true },
  { name: 'venue', label: 'Lieu', type: 'text', required: true },
  { 
    name: 'status', 
    label: 'Statut', 
    type: 'select',
    options: ['disponible', 'sold out'],
    required: true 
  }
];

export default function ConcertForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    CHAMPS_STANDARDS.reduce((acc, champ) => ({
      ...acc,
      [champ.name]: champ.type === 'number' ? 0 : ''
    }), {})
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData(
        CHAMPS_STANDARDS.reduce((acc, champ) => ({
          ...acc,
          [champ.name]: champ.type === 'number' ? 0 : ''
        }), {})
      );
    }
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
      
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6">Informations sur le concert</Typography>
            
            {CHAMPS_STANDARDS.map((champ) => (
              champ.type === 'select' ? (
                <TextField
                  key={champ.name}
                  select
                  label={champ.label}
                  value={formData[champ.name] || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
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
                  value={champ.type === 'date' && formData[champ.name] 
                    ? formData[champ.name].split('T')[0]
                    : formData[champ.name] || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
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

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          type="submit"
        >
          {initialData?.id ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}