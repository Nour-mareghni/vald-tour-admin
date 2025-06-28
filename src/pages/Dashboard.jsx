import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box , Paper, TextField, Checkbox, IconButton } from "@mui/material";
import LogoutButton from '../components/LogoutButton';
import { Edit, Delete } from "@mui/icons-material";
import AppBarWithLogout from '../components/AppBarWithLogout';

export default function Dashboard() {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState({
    concertDate: "",
    city: "",
    country: "",
    venue: "",
    isSoldOut: false,
  });

  // Fetch tour dates from Firestore
  useEffect(() => {
    const fetchDates = async () => {
      const querySnapshot = await getDocs(collection(db, "tourDates"));
      setDates(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDates();
  }, []);

  // Add a new date
  const handleAddDate = async () => {
    await addDoc(collection(db, "tourDates"), newDate);
    setNewDate({ ...newDate, concertDate: "", city: "", country: "", venue: "" });
  };

  return (
        <>
      <AppBarWithLogout />
    <div>
      <h1>Tour Dates Management</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Sold Out?</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dates.map((date) => (
              <TableRow key={date.id}>
                <TableCell>{date.concertDate}</TableCell>
                <TableCell>{date.city}</TableCell>
                <TableCell>{date.country}</TableCell>
                <TableCell>{date.venue}</TableCell>
                <TableCell>
                  <Checkbox checked={date.isSoldOut} />
                </TableCell>
                <TableCell>
                  <IconButton><Edit /></IconButton>
                  <IconButton><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </>
  );
}