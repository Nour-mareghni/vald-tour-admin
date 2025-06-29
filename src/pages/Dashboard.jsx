// Import des dépendances React et Firebase
import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase'; // Import de la configuration Firebase

// Import des composants personnalisés
import TournamentForm from '../components/TournamentForm'; // Formulaire de tournoi
import TournamentsTable from '../components/TournamentsTable'; // Tableau des tournois
import Button from '@mui/material/Button'; // Composant bouton Material-UI
import Box from '@mui/material/Box'; // Composant layout Material-UI
import AppBarWithLogout from '../components/AppBarWithLogout'; // Barre d'application avec déconnexion

export default function TournamentsDashboard() {
  // États du composant
  const [tournaments, setTournaments] = useState([]); // Liste des tournois
  const [openForm, setOpenForm] = useState(false); // Contrôle l'ouverture du formulaire
  const [currentTournament, setCurrentTournament] = useState(null); // Tournoi sélectionné pour édition

  // Effet pour charger les tournois au montage du composant
  useEffect(() => {
    const fetchTournaments = async () => {
      // Récupération des documents depuis la collection 'tournaments'
      const querySnapshot = await getDocs(collection(db, 'tournaments'));
      // Transformation des données et mise à jour de l'état
      setTournaments(querySnapshot.docs.map(doc => ({ 
        id: doc.id, // Ajout de l'ID du document
        ...doc.data() // Récupération de toutes les données du document
      })));
    };
    fetchTournaments();
  }, []); // Tableau de dépendances vide = exécuté une fois au montage

  // Opérations CRUD (Create, Read, Update, Delete)

  // Création d'un nouveau tournoi
  const handleCreate = async (data) => {
    // Ajout d'un nouveau document dans la collection 'tournaments'
    await addDoc(collection(db, 'tournaments'), data);
    setOpenForm(false); // Fermeture du formulaire
    // Rafraîchissement de la liste
    const querySnapshot = await getDocs(collection(db, 'tournaments'));
    setTournaments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Mise à jour d'un tournoi existant
  const handleUpdate = async (data) => {
    // Mise à jour du document spécifique avec l'ID du tournoi actuel
    await updateDoc(doc(db, 'tournaments', currentTournament.id), data);
    setOpenForm(false); // Fermeture du formulaire
    // Rafraîchissement de la liste
    const querySnapshot = await getDocs(collection(db, 'tournaments'));
    setTournaments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Suppression d'un tournoi
  const handleDelete = async (id) => {
    // Suppression du document avec l'ID spécifié
    await deleteDoc(doc(db, 'tournaments', id));
    // Rafraîchissement de la liste
    const querySnapshot = await getDocs(collection(db, 'tournaments'));
    setTournaments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Rendu du composant
  return (
    <>
      {/* Barre d'application avec bouton de déconnexion */}
      <AppBarWithLogout />
      
      {/* Contenu principal avec padding */}
      <Box sx={{ p: 3 }}>
        {/* Tableau des tournois avec gestion des actions */}
        <TournamentsTable
          tournaments={tournaments} // Passage de la liste des tournois
          onEdit={(tournament) => {
            setCurrentTournament(tournament); // Sélection du tournoi à éditer
            setOpenForm(true); // Ouverture du formulaire
          }}
          onDelete={handleDelete} // Passage de la fonction de suppression
        />

        {/* Formulaire de tournoi (création/édition) */}
        <TournamentForm
          open={openForm} // Contrôle l'ouverture/fermeture
          onClose={() => setOpenForm(false)} // Fonction de fermeture
          onSubmit={currentTournament ? handleUpdate : handleCreate} // Choix de la fonction selon le mode
          initialData={currentTournament} // Données initiales pour l'édition
        />
      </Box>
    </>
  );
}