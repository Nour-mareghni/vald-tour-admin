import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Chip,
  Button,
  Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import TournamentForm from './TournamentForm';

const statusColors = {
  upcoming: 'primary',    // À venir
  ongoing: 'warning',     // En cours
  completed: 'success'    // Terminé
};

export default function TableauTournois() {
  const [tournois, setTournois] = useState([]);
  const [formOuvert, setFormOuvert] = useState(false);

  const handleCreerTournoi = (nouveauTournoi) => {
    setTournois([...tournois, { 
      id: Date.now().toString(),
      ...nouveauTournoi 
    }]);
  };

  const handleSupprimer = (id) => {
    setTournois(tournois.filter(t => t.id !== id));
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={() => setFormOuvert(true)}
        sx={{ mb: 3 }}
      >
        Ajouter un nouveau tournoi
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Prix d'entrée</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tournois.map((tournoi) => (
              <TableRow key={tournoi.id}>
                <TableCell>{tournoi.name}</TableCell>
                <TableCell>{new Date(tournoi.date).toLocaleDateString()}</TableCell>
                <TableCell>{tournoi.city}, {tournoi.country}</TableCell>
                <TableCell>{tournoi.venue}</TableCell>
                <TableCell>${tournoi.entryFee}</TableCell>
                <TableCell>
                  <Chip 
                    label={tournoi.status} 
                    color={statusColors[tournoi.status]} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleSupprimer(tournoi.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TournamentForm 
        open={formOuvert}
        onClose={() => setFormOuvert(false)}
        onSubmit={handleCreerTournoi}
      />
    </Box>
  );
}