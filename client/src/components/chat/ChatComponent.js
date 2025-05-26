import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Container,
} from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatComponent = ({ loadId, vendorId, driverId, open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const q = query(
      collection(db, 'chats'),
      where('loadId', '==', loadId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadId, open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        loadId,
        vendorId,
        driverId,
        senderId: currentUser.uid,
        senderRole: currentUser.uid === vendorId ? 'vendor' : 'driver',
        content: newMessage.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'chats'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  if (!open) return null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          mt: 10,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 5,
            background: 'rgba(255,255,255,0.10)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            borderImage: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) 1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              color: '#43e97b',
              bgcolor: 'rgba(67,233,123,0.1)',
              zIndex: 10,
              '&:hover': {
                bgcolor: 'rgba(67,233,123,0.2)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Paper 
            elevation={0} 
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: 2,
              backgroundColor: '#f5f5f5',
              mb: 2
            }}
          >
            <List>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    flexDirection: message.senderId === currentUser.uid ? 'row-reverse' : 'row',
                    mb: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {message.senderRole === 'vendor' ? 'V' : 'D'}
                    </Avatar>
                  </ListItemAvatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.senderId === currentUser.uid ? 'primary.main' : 'white',
                      color: message.senderId === currentUser.uid ? 'white' : 'text.primary',
                    }}
                  >
                    <ListItemText
                      primary={message.content}
                      secondary={
                        <Typography variant="caption" color={message.senderId === currentUser.uid ? 'white' : 'text.secondary'}>
                          {message.createdAt?.toDate().toLocaleTimeString()}
                        </Typography>
                      }
                    />
                  </Paper>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Paper>

          <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ChatComponent; 