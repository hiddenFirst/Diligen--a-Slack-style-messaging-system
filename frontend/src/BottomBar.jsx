import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from './App';

/**
 * @returns {object} JSX
 */
function BottomBar() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const {selectedWorkspace, setLastLocation} = useAuth();

  const handleHome = async () => {
    const token = localStorage.getItem('token');
    if (token) {
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
    }

    setLastLocation({
      workspaceId: selectedWorkspace.id,
      channelId: null,
      messageId: null,
    });

    navigate('/home');
  };

  return (
    <Paper aria-label = 'bottom-bar'
      sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />}
          onClick={handleHome}/>
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />}
          onClick={() => {
            navigate('/settings');
          }}/>
      </BottomNavigation>
    </Paper>
  );
}

export default BottomBar;
