import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const statusColors = {
  upcoming: 'primary',
  ongoing: 'warning',
  completed: 'success'
};

export default function TournamentsTable({ tournaments, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Venue</TableCell>
            <TableCell>Entry Fee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tournaments.map((tournament) => (
            <TableRow key={tournament.id}>
              <TableCell>{tournament.name}</TableCell>
              <TableCell>{new Date(tournament.date).toLocaleDateString()}</TableCell>
              <TableCell>{tournament.city}, {tournament.country}</TableCell>
              <TableCell>{tournament.venue}</TableCell>
              <TableCell>${tournament.entryFee}</TableCell>
              <TableCell>
                <Chip 
                  label={tournament.status} 
                  color={statusColors[tournament.status]} 
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(tournament)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(tournament.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}