import {useState} from 'react';
import MessageTopbar from './MessageTopbar';
import MessageViewer from './MessageViewer';
import MessagePost from './MessagePost';
import {useAuth} from './App';

/**
 * @returns {object} JSX
 */
export default function MessagePage() {
  const {selectedChannels} = useAuth();
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3010/api/v0/messages?channelId=${selectedChannels.id}`, {
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`},
    });

    if (response.ok) {
      const data = await response.json();
      setMessages(data);
    }
  };

  return (
    <>
      <MessageTopbar />
      <MessageViewer fetchMessages={fetchMessages} messages={messages}/>
      <MessagePost fetchMessages={fetchMessages} />
    </>
  );
}
