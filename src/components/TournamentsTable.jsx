import { useState, useEffect } from 'react';
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
import { db } from '../firebase';
import { updateDoc,addDoc,collection, getDocs, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

const statusColors = {
  upcoming: 'primary',
  ongoing: 'warning',
  completed: 'success'
};

export default function TableauTournois() {
  const [tournois, setTournois] = useState([]);
  const [formOuvert, setFormOuvert] = useState(false);
  const [tournoiActuel, setTournoiActuel] = useState(null);

  // Charger les tournois depuis Firestore
  useEffect(() => {
    const chargerTournois = async () => {
      const querySnapshot = await getDocs(collection(db, 'tournaments'));
      const donneesTournois = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTournois(donneesTournois);
    };

    chargerTournois();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tournaments'), (snapshot) => {
      const donneesTournois = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTournois(donneesTournois);
    });

    return () => unsubscribe(); // Nettoyage
  }, []);

  const handleSupprimer = async (id) => {
    try {
      await deleteDoc(doc(db, 'tournaments', id));
      setTournois(tournois.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleSoumettre = async (donneesTournoi) => {
    try {
      if (tournoiActuel) {
        await updateDoc(doc(db, 'tournaments', tournoiActuel.id), donneesTournoi);
      } else {
        await addDoc(collection(db, 'tournaments'), {
          ...donneesTournoi,
          createdAt: new Date() // Optionnel: ajoute un timestamp
        });
      }
      setFormOuvert(false);
      setTournoiActuel(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };


  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={() => {
          setTournoiActuel(null);
          setFormOuvert(true);
        }}
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
                  <IconButton onClick={() => {
                    setTournoiActuel(tournoi);
                    setFormOuvert(true);
                  }}>
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
        onClose={() => {
          setFormOuvert(false);
          setTournoiActuel(null);
        }}
        onSubmit={handleSoumettre}
        initialData={tournoiActuel || {}}
      />
    </Box>
  );
}