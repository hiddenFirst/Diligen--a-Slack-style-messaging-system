import {useEffect} from 'react';
import {Typography, Container, Paper} from '@mui/material';
import {useAuth} from './App';
import {useNavigate} from 'react-router-dom';

/**
 * @returns {object} JSX
 */
export default function Channels() {
  const navigate = useNavigate();
  const {selectedWorkspace, channels,
    setChannels, setSelectedChannels,
    lastLocation} = useAuth();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const token = localStorage.getItem('token');
      const URL = `http://localhost:3010/api/v0/channels?workspaces=${selectedWorkspace.id}`;
      const response = await fetch(URL, {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`},
      });

      if (response.ok) {
        const data = await response.json();
        setChannels(data);
        const matchedChannel = data.find((c) =>
          (c.id) === lastLocation?.channelId);
        if (matchedChannel) {
          setSelectedChannels(matchedChannel);
          navigate('/messages');
        }
      }
    };

    fetchWorkspaces();
  }, [selectedWorkspace]);

  const handleSelectChannel = async (channel) => {
    setSelectedChannels(channel);
    navigate('/messages');

    const token = localStorage.getItem('token');
    await fetch('http://localhost:3010/api/v0/lastlocation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({workspaceId: selectedWorkspace.id,
        channelId: channel.id, messageId: null}),
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{padding: 2, mt: 2}}>
        {channels.map((channel) => (
          <Typography key={channel.id} variant="body1" align="left"
            onClick={() => handleSelectChannel(channel)}
            sx={{
              'cursor': 'pointer',
              'padding': '8px',
              'borderRadius': '4px',
              'transition': 'background-color 0.3s ease',
              '&:hover': {backgroundColor: '#E0E0E0'},
            }}>
                # {channel.name}
          </Typography>
        ))}
      </Paper>
    </Container>
  );
}
