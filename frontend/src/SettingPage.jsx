import {useNavigate} from 'react-router-dom';
import {useAuth} from './App';
import {
  Container,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Box,
} from '@mui/material';
import {green} from '@mui/material/colors';
import LogoutIcon from '@mui/icons-material/Logout';
import {useEffect} from 'react';

/**
 * @returns {object} JSX
 */
export default function SettingPage() {
  const navigate = useNavigate();
  const {setIsAuthenticated, selectedWorkspace, setWorkspaces,
    userName, status, setStatus} = useAuth();

  useEffect(() => {
    setStatus('Active');
  }, [userName]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
    setWorkspaces([]);
  };

  const handleUpdateStatus = () => {
    alert(`Status updated to: ${status}`);
  };

  const handleSetAway = () => {
    setStatus('Away');
  };

  return (
    <Container maxWidth="sm" sx={{marginTop: 2}}>
      <Paper elevation={3} sx={{p: 2}}>
        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
          <Avatar sx={{bgcolor: green[500], width: 56, height: 56}}>
            {userName.charAt(0)}
          </Avatar>
          <Box sx={{ml: 2}}>
            <Typography variant="h6">{userName}</Typography>
            <Typography aria-label='status' variant="subtitle1" color="green">
              {status}
            </Typography>
          </Box>
        </Box>

        {/* status type box */}
        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
          <TextField
            aria-label='statusEntryBox'
            variant="outlined"
            size="small"
            placeholder="Update your status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{flex: 1, mr: 1}}
          />
          <Button onClick={handleUpdateStatus} variant="outlined">
            Update
          </Button>
        </Box>

        {/* setting yourself as AWAY */}
        <Box sx={{mb: 2}}>
          <Button color="error" variant="text" onClick={handleSetAway}>
            Set yourself as AWAY
          </Button>
        </Box>

        {/* Sign out of workspace */}
        <Box
          aria-label='logout'
          sx={{
            borderTop: '1px solid #ccc',
            mt: 2,
            pt: 2,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={handleLogout}
        >
          <LogoutIcon sx={{mr: 1}} />
          <Typography variant="body1">
            Sign out of {selectedWorkspace?.name || 'Workspace'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
