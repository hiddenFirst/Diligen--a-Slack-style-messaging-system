import {AppBar, Toolbar, Typography, IconButton} from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import {useNavigate} from 'react-router-dom';
import {useAuth} from './App';

/**
 * @returns {object} JSX
 */
export default function MessageTopbar() {
  const navigate = useNavigate();
  const {selectedChannels, selectedWorkspace, setLastLocation} = useAuth();

  const handleBackToHome = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3010/api/v0/lastlocation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        workspaceId: selectedWorkspace.id,
        channelId: null,
        messageId: null,
      }),
    });

    setLastLocation({
      workspaceId: selectedWorkspace.id,
      channelId: null,
      messageId: null,
    });

    navigate('/home');
  };

  return (
    <AppBar aria-label = 'header'
      position="static" sx={{backgroundColor: '#4A235A'}}>
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
        <IconButton aria-label = 'Back-To-Home'
          color="inherit" onClick={handleBackToHome}>
          <ArrowCircleLeftIcon />
        </IconButton>
        <Typography variant="h6">
          {selectedChannels.name}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
