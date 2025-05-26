import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

const ChatComponent = ({ loadId, vendorId, driverId, open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!loadId) return;

    const q = query(
      collection(db, 'chats'),
      where('loadId', '==', loadId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [loadId]);

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
      await addDoc(collection(db, 'chats'), {
        loadId,
        senderId: currentUser.uid,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'chats', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chat</DialogTitle>
      <DialogContent>
        <Box sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem
                  sx={{
                    justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      backgroundColor: message.senderId === currentUser.uid ? 'primary.main' : 'grey.200',
                      color: message.senderId === currentUser.uid ? 'white' : 'text.primary',
                      borderRadius: 2,
                      p: 1,
                      position: 'relative',
                    }}
                  >
                    <Typography variant="caption" display="block" color="text.secondary">
                      {message.senderName} ({message.senderRole})
                    </Typography>
                    <Typography variant="body1">{message.message}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {message.timestamp?.toDate().toLocaleString()}
                    </Typography>
                    {message.senderId === currentUser.uid && (
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 0, right: 0, color: 'error.main' }}
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{
              display: 'flex',
              gap: 1,
              mt: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <Button type="submit" variant="contained">
              Send
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatComponent; 