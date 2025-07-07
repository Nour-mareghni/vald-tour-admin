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
import ConcertForm from '../components/ConcertForm'; // Formulaire de concert
import ConcertsTable from '../components/ConcertsTable'; // Tableau des concerts
import Button from '@mui/material/Button'; // Composant bouton Material-UI
import Box from '@mui/material/Box'; // Composant layout Material-UI
import AppBarWithLogout from '../components/AppBarWithLogout'; // Barre d'application avec déconnexion

export default function ConcertsDashboard() {
  // États du composant
  const [concerts, setConcerts] = useState([]); // Liste des concerts
  const [openForm, setOpenForm] = useState(false); // Contrôle l'ouverture du formulaire
  const [currentConcert, setCurrentConcert] = useState(null); // Concert sélectionné pour édition

  // Effet pour charger les concerts au montage du composant
  useEffect(() => {
    const fetchConcerts = async () => {
      // Récupération des documents depuis la collection 'concerts'
      const querySnapshot = await getDocs(collection(db, 'concerts'));
      // Transformation des données et mise à jour de l'état
      setConcerts(querySnapshot.docs.map(doc => ({ 
        id: doc.id, // Ajout de l'ID du document
        ...doc.data() // Récupération de toutes les données du document
      })));
    };
    fetchConcerts();
  }, []); // Tableau de dépendances vide = exécuté une fois au montage

  // Opérations CRUD (Create, Read, Update, Delete)

  // Création d'un nouveau concert
  const handleCreate = async (data) => {
    // Ajout d'un nouveau document dans la collection 'concerts'
    await addDoc(collection(db, 'concerts'), data);
    setOpenForm(false); // Fermeture du formulaire
    // Rafraîchissement de la liste
    const querySnapshot = await getDocs(collection(db, 'concerts'));
    setConcerts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Mise à jour d'un concert existant
  const handleUpdate = async (data) => {
    // Mise à jour du document spécifique avec l'ID du concert actuel
    await updateDoc(doc(db, 'concerts', currentConcert.id), data);
    setOpenForm(false); // Fermeture du formulaire
    // Rafraîchissement de la liste
    const querySnapshot = await getDocs(collection(db, 'concerts'));
    setConcerts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Suppression d'un concert
  const handleDelete = async (id) => {
    // Suppression du document avec l'ID spécifié
    await deleteDoc(doc(db, 'concerts', id));
    // Rafraîchissement de la liste
    const querySnapshot = await getDocs(collection(db, 'concerts'));
    setConcerts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Rendu du composant
  return (
    <>
      {/* Barre d'application avec bouton de déconnexion */}
      <AppBarWithLogout />
      
      {/* Contenu principal avec padding */}
      <Box sx={{ p: 3 }}>
        {/* Bouton pour ajouter un nouveau concert */}


        {/* Tableau des concerts avec gestion des actions */}
        <ConcertsTable
          concerts={concerts} // Passage de la liste des concerts
          onEdit={(concert) => {
            setCurrentConcert(concert); // Sélection du concert à éditer
            setOpenForm(true); // Ouverture du formulaire
          }}
          onDelete={handleDelete} // Passage de la fonction de suppression
        />

        {/* Formulaire de concert (création/édition) */}
        <ConcertForm
          open={openForm} // Contrôle l'ouverture/fermeture
          onClose={() => setOpenForm(false)} // Fonction de fermeture
          onSubmit={currentConcert ? handleUpdate : handleCreate} // Choix de la fonction selon le mode
          initialData={currentConcert} // Données initiales pour l'édition
        />
      </Box>
    </>
  );
}