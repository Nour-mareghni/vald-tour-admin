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

// Updated status colors
const statusColors = {
  'disponible': 'success',
  'sold out': 'error'
};

export default function ConcertTable() {
  const [concerts, setConcerts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [currentConcert, setCurrentConcert] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [concertToDelete, setConcertToDelete] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'concerts'), (snapshot) => {
      const concertData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConcerts(concertData);
    });

    return () => unsubscribe();
  }, []);

  const confirmDelete = (concert) => {
    setConcertToDelete(concert);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!concertToDelete?.id) {
      console.error("No concert ID to delete");
      return;
    }

    try {
      await deleteDoc(doc(db, 'concerts', concertToDelete.id));
      setDeleteOpen(false);
      setConcertToDelete(null);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmit = async (concertData) => {
    try {
      if (currentConcert) {
        await updateDoc(doc(db, 'concerts', currentConcert.id), concertData);
      } else {
        await addDoc(collection(db, 'concerts'), {
          ...concertData,
          createdAt: new Date()
        });
      }
      setFormOpen(false);
      setCurrentConcert(null);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={() => {
          setCurrentConcert(null);
          setFormOpen(true);
        }}
        sx={{ mb: 3 }}
      >
        Ajouter un nouveau concert
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Ville</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {concerts.map((concert) => (
              <TableRow key={concert.id}>
                <TableCell>{new Date(concert.date).toLocaleDateString()}</TableCell>
                <TableCell>{concert.city}</TableCell>
                <TableCell>{concert.country}</TableCell>
                <TableCell>{concert.venue}</TableCell>
                <TableCell>
                  <Chip 
                    label={concert.status} 
                    color={statusColors[concert.status]} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setCurrentConcert(concert);
                    setFormOpen(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(concert)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le concert du {concertToDelete && new Date(concertToDelete.date).toLocaleDateString()} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <ConcertForm 
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setCurrentConcert(null);
        }}
        onSubmit={handleSubmit}
        initialData={currentConcert || {}}
      />
    </Box>
  );
}