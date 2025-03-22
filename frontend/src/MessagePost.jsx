import {useState} from 'react';
import {TextField, IconButton, Paper} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {useAuth} from './App';
import PropTypes from 'prop-types';

/**
 *
 * @param {object} props - prop
 * @param {object} [props.fetchMessages] - fetchMessages
 * @returns {object} JSX
 */
export default function MessagePost({fetchMessages}) {
  const {selectedChannels} = useAuth();
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3010/api/v0/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({channelId: selectedChannels.id, text: message}),
    });

    if (response.ok) {
      setMessage('');
      fetchMessages();
    }
  };

  return (
    <Paper sx={{display: 'flex', alignItems: 'center',
      padding: 1, position: 'fixed', bottom: '56px', width: '100%'}}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={`Send a message to ${selectedChannels.name}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <IconButton aria-label = 'post'
        color="primary" onClick={handleSendMessage}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
}

MessagePost.propTypes = {
  fetchMessages: PropTypes.func.isRequired,
};
