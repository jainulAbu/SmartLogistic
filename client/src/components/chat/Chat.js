import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const db = getFirestore();
  const storage = getStorage();
  const auth = getAuth();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const userId = auth.currentUser.uid;
      const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId)
      );
      
      const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
        const chatsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChats(chatsData);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messagesData);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !uploadingFile) return;

    try {
      const messageData = {
        text: newMessage,
        senderId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        type: 'text',
      };

      await addDoc(collection(db, 'chats', selectedChat.id, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const storageRef = ref(storage, `chat-files/${selectedChat.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const messageData = {
        text: '',
        fileUrl: downloadURL,
        fileName: file.name,
        fileType: file.type,
        senderId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
      };

      await addDoc(collection(db, 'chats', selectedChat.id, 'messages'), messageData);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, height: 'calc(100vh - 100px)' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Chat List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <List>
              {chats.map((chat) => (
                <React.Fragment key={chat.id}>
                  <ListItem
                    button
                    selected={selectedChat?.id === chat.id}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="error"
                        variant="dot"
                        invisible={!chat.unreadCount}
                      >
                        <Avatar src={chat.participantAvatar}>
                          {chat.participantName?.[0]}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.participantName}
                      secondary={chat.lastMessage}
                      primaryTypographyProps={{
                        fontWeight: chat.unreadCount ? 'bold' : 'normal',
                      }}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Chat Window */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">
                    {selectedChat.participantName}
                  </Typography>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.senderId === auth.currentUser.uid ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          bgcolor: message.senderId === auth.currentUser.uid ? 'primary.main' : 'grey.100',
                          color: message.senderId === auth.currentUser.uid ? 'white' : 'text.primary',
                          p: 2,
                          borderRadius: 2,
                        }}
                      >
                        {message.type === 'text' && (
                          <Typography>{message.text}</Typography>
                        )}
                        {message.type === 'image' && (
                          <Box
                            component="img"
                            src={message.fileUrl}
                            alt={message.fileName}
                            sx={{ maxWidth: '100%', borderRadius: 1 }}
                          />
                        )}
                        {message.type === 'file' && (
                          <Button
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<AttachFileIcon />}
                          >
                            {message.fileName}
                          </Button>
                        )}
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                          {formatTimestamp(message.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box
                  component="form"
                  onSubmit={handleSendMessage}
                  sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={uploadingFile}
                  />
                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={!newMessage.trim() && !uploadingFile}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Select a chat to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat; 