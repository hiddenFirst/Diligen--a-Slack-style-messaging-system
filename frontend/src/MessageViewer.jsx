import {useEffect} from 'react';
import {Container, Typography, Paper, Avatar, Box} from '@mui/material';
import {useAuth} from './App';
import PropTypes from 'prop-types';

const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach((message) => {
    const date = new Date(message.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  return groups;
};

/**
 * MessageViewer
 * @param {object} props - prop
 * @param {Array} props.messages messages
 * @param {object} props.fetchMessages fetching
 * @returns {object} JSX
 */
export default function MessageViewer({messages, fetchMessages}) {
  const {selectedChannels} = useAuth();

  useEffect(() => {
    fetchMessages();
  }, [selectedChannels]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Container sx={{paddingBottom: '80px'}}>
      {Object.keys(groupedMessages).map((date) => (
        <Box key={date} sx={{marginBottom: 2}}>
          <Typography
            aria-label="message-date"
            variant="subtitle1"
            sx={{fontWeight: 'bold', color: '#555', marginTop: 2}}
          >
            {date}
          </Typography>
          {groupedMessages[date].map((message) => (
            <Paper key={message.id} sx={{padding: 2, marginY: 1}}>
              <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                <Avatar sx={{width: 32, height: 32, marginRight: 1}}>
                  {message.sender.charAt(0)}
                </Avatar>
                <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>
                  {message.sender}{' '}
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{color: 'gray', marginLeft: 1}}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Typography>
              </Box>
              <Typography variant="body1">{message.text}</Typography>
              {message.thread.length > 0 && (
                <Typography variant="body2" color="primary" sx={{mt: 1}}>
                  {message.thread.length} Replies
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      ))}
    </Container>
  );
}

MessageViewer.propTypes = {
  messages: PropTypes.array.isRequired,
  fetchMessages: PropTypes.func.isRequired,
};
