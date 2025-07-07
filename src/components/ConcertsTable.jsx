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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ConcertForm from './ConcertForm';
import { db } from '../firebase';
import { updateDoc, addDoc, collection, getDocs, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

const statusColors = {
  upcoming: 'primary',
  ongoing: 'warning',
  completed: 'success'
};

export default function TableauConcerts() {
  const [concerts, setConcerts] = useState([]);
  const [formOuvert, setFormOuvert] = useState(false);
  const [concertActuel, setConcertActuel] = useState(null);
  const [suppressionOuverte, setSuppressionOuverte] = useState(false);
  const [concertASupprimer, setConcertASupprimer] = useState(null);

  // Charger les concerts depuis Firestore
  useEffect(() => {
    const chargerConcerts = async () => {
      const querySnapshot = await getDocs(collection(db, 'concerts'));
      const donneesConcerts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConcerts(donneesConcerts);
    };

    chargerConcerts();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'concerts'), (snapshot) => {
      const donneesConcerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConcerts(donneesConcerts);
    });

    return () => unsubscribe(); // Nettoyage
  }, []);

  const confirmerSuppression = (concert) => {
    setConcertASupprimer(concert);
    setSuppressionOuverte(true);
  };

  const handleSupprimer = async () => {
    if (!concertASupprimer?.id) {
      console.error("Aucun ID de concert à supprimer");
      return;
    }

    try {
      await deleteDoc(doc(db, 'concerts', concertASupprimer.id));
      setSuppressionOuverte(false);
      setConcertASupprimer(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleSoumettre = async (donneesConcert) => {
    try {
      if (concertActuel) {
        await updateDoc(doc(db, 'concerts', concertActuel.id), donneesConcert);
      } else {
        await addDoc(collection(db, 'concerts'), {
          ...donneesConcert,
          createdAt: new Date() // Optionnel: ajoute un timestamp
        });
      }
      setFormOuvert(false);
      setConcertActuel(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={() => {
          setConcertActuel(null);
          setFormOuvert(true);
        }}
        sx={{ mb: 3 }}
      >
        Ajouter un nouveau concert
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Artiste</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Ville</TableCell>
              <TableCell>Lieu</TableCell>
              
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {concerts.map((concert) => (
              <TableRow key={concert.id}>
                <TableCell>{concert.artist}</TableCell>
                <TableCell>{new Date(concert.date).toLocaleDateString()}</TableCell>
                <TableCell>{concert.city}, {concert.country}</TableCell>
                <TableCell>{concert.venue}</TableCell>
                
                <TableCell>
                  <Chip 
                    label={concert.status} 
                    color={statusColors[concert.status]} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setConcertActuel(concert);
                    setFormOuvert(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => confirmerSuppression(concert)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={suppressionOuverte}
        onClose={() => setSuppressionOuverte(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le concert "{concertASupprimer?.artist}" ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuppressionOuverte(false)}>Annuler</Button>
          <Button 
            onClick={handleSupprimer} 
            color="error"
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <ConcertForm 
        open={formOuvert}
        onClose={() => {
          setFormOuvert(false);
          setConcertActuel(null);
        }}
        onSubmit={handleSoumettre}
        initialData={concertActuel || {}}
      />
    </Box>
  );
}