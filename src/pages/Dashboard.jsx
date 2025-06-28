import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import TournamentForm from '../components/TournamentForm';
import TournamentsTable from '../components/TournamentsTable';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AppBarWithLogout from '../components/AppBarWithLogout';

export default function TournamentsDashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentTournament, setCurrentTournament] = useState(null);

  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      const querySnapshot = await getDocs(collection(db, 'tournaments'));
      setTournaments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTournaments();
  }, []);

  // CRUD Operations
  const handleCreate = async (data) => {
    await addDoc(collection(db, 'tournaments'), data);
    setOpenForm(false);
    // Refresh list
    const querySnapshot = await getDocs(collection(db, 'tournaments'));
    setTournaments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleUpdate = async (data) => {
    await updateDoc(doc(db, 'tournaments', currentTournament.id), data);
    setOpenForm(false);
    // Refresh list
    const querySnapshot = await getDocs(collection(db, 'tournaments'));
    setTournaments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'tournaments', id));
    // Refresh list
    const querySnapshot = await getDocs(collection(db, 'tournaments'));
    setTournaments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <>
    <AppBarWithLogout />
    <Box sx={{ p: 3 }}>

      <TournamentsTable
        tournaments={tournaments}
        onEdit={(tournament) => {
          setCurrentTournament(tournament);
          setOpenForm(true);
        }}
        onDelete={handleDelete}
      />

      <TournamentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={currentTournament ? handleUpdate : handleCreate}
        initialData={currentTournament}
      />
    </Box>
    </>
  );
}