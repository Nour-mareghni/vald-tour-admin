
import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button 
      color="error"
      variant="contained"
      onClick={handleLogout}
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1000
      }}
    >
      Logout
    </Button>
  );
}