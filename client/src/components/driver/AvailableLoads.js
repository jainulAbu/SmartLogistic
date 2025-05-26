import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Chip,
  Avatar,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import DriverNavbar from '../layout/DriverNavbar';

const glassCardStyle = {
  p: 3,
  borderRadius: 4,
  background: 'rgba(17, 17, 17, 0.95)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(67,233,123,0.15)',
  color: '#fff',
  fontWeight: 700,
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  '&:hover': {
    boxShadow: '0 8px 32px 0 rgba(67,233,123,0.25)',
    borderColor: '#43e97b',
    transform: 'translateY(-2px) scale(1.01)',
  },
};

const AvailableLoads = () => {
  const [availableLoads, setAvailableLoads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatGoods, setChatGoods] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const db = getFirestore();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchAvailableLoads();
  }, []);

  const fetchAvailableLoads = async () => {
    try {
      const availableLoadsQuery = query(
        collection(db, 'goods'),
        where('status', '==', 'Available')
      );
      const snapshot = await getDocs(availableLoadsQuery);
      const loads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAvailableLoads(loads);
    } catch (error) {
      console.error('Error fetching available loads:', error);
    }
  };

  const filteredLoads = availableLoads.filter((d) =>
    d.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.deliveryLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestLoad = async (load) => {
    try {
      await updateDoc(doc(db, 'goods', load.id), {
        driverId: currentUser.uid,
        status: 'Requested',
        requestedAt: new Date(),
      });
      setSnackbarMsg('Request sent to vendor!');
      setSnackbarOpen(true);
      // Remove from local list
      setAvailableLoads((prev) => prev.filter((l) => l.id !== load.id));
    } catch (error) {
      setSnackbarMsg('Failed to request load.');
      setSnackbarOpen(true);
    }
  };

  // Chat open handler
  const handleOpenChat = (goods) => {
    setChatGoods(goods);
    setChatOpen(true);
  };

  // Listen for chat updates
  useEffect(() => {
    if (chatOpen && chatGoods && currentUser) {
      const chatDocId = `${chatGoods.id}_${chatGoods.vendorId}`;
      const chatRef = doc(db, 'goodsChats', chatDocId);
      const unsub = onSnapshot(chatRef, (docSnap) => {
        if (docSnap.exists()) {
          setChatHistory(docSnap.data().messages || []);
        } else {
          setChatHistory([]);
        }
      });
      return () => unsub();
    }
  }, [chatOpen, chatGoods, db, currentUser]);

  // Send chat message
  const handleSendChat = async () => {
    if (!chatMessage || !chatGoods) return;
    const chatDocId = `${chatGoods.id}_${chatGoods.vendorId}`;
    const chatRef = doc(db, 'goodsChats', chatDocId);
    const newMsg = {
      sender: 'driver',
      senderId: currentUser.uid,
      text: chatMessage,
      timestamp: serverTimestamp(),
    };
    let chatDoc = await getDocs(query(collection(db, 'goodsChats'), where('goodsId', '==', chatGoods.id), where('vendorId', '==', chatGoods.vendorId)));
    if (!chatDoc.empty) {
      // Update existing
      await updateDoc(chatRef, {
        messages: [...chatHistory, { ...newMsg, timestamp: new Date() }],
      });
    } else {
      // Create new
      await setDoc(chatRef, {
        goodsId: chatGoods.id,
        vendorId: chatGoods.vendorId,
        driverId: currentUser.uid,
        messages: [{ ...newMsg, timestamp: new Date() }],
      });
    }
    setChatMessage('');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)' }}>
      <DriverNavbar />
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 700, mb: 4, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Available Loads
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              size="small"
              label="Search by Location"
              variant="outlined"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{ bgcolor: 'rgba(67,233,123,0.08)', borderRadius: 2, input: { color: '#fff' }, label: { color: '#43e97b' }, '& .MuiOutlinedInput-root': { color: '#fff', borderColor: '#43e97b' } }}
            />
          </Box>
          <Grid container spacing={3}>
            {filteredLoads.map((load) => (
              <Grid item xs={12} md={6} key={load.id}>
                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#181818', color: '#fff', boxShadow: '0 2px 12px #0008', mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {load.imageUrl && (
                        <img src={load.imageUrl} alt={load.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 16, border: '1px solid #43e97b' }} />
                      )}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{load.name}</Typography>
                        <Typography sx={{ fontSize: 15, color: '#43e97b', mb: 1 }}>
                          {load.pickupLocation} → {load.deliveryLocation}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }}><b>Type:</b> {load.type}</Typography>
                        <Typography sx={{ fontSize: 14 }}><b>Weight:</b> {load.weight}</Typography>
                        <Typography sx={{ fontSize: 14 }}><b>Description:</b> {load.description}</Typography>
                        <Typography sx={{ fontSize: 14 }}><b>Amount:</b> {load.amount}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Chip label={load.status} color={load.status === 'Available' ? 'success' : 'default'} sx={{ mb: 1 }} />
                      <IconButton color="primary" onClick={() => { setSelectedLoad(load); setDetailsDialogOpen(true); }}><VisibilityIcon /></IconButton>
                      <IconButton color="primary" onClick={() => handleOpenChat(load)}><ChatIcon /></IconButton>
                      <Button size="small" variant="contained" color="success" sx={{ mt: 1 }} onClick={() => handleRequestLoad(load)}>
                        Request
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Load Details</DialogTitle>
        <DialogContent>
          {selectedLoad && (
            <Box>
              {selectedLoad.imageUrl && (
                <img src={selectedLoad.imageUrl} alt={selectedLoad.name} style={{ width: '100%', maxHeight: 250, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
              )}
              <Typography variant="h6">{selectedLoad.name}</Typography>
              <Typography><b>Pickup Location:</b> {selectedLoad.pickupLocation}</Typography>
              <Typography><b>Drop Location:</b> {selectedLoad.deliveryLocation}</Typography>
              <Typography><b>Type:</b> {selectedLoad.type}</Typography>
              <Typography><b>Weight:</b> {selectedLoad.weight}</Typography>
              <Typography><b>Description:</b> {selectedLoad.description}</Typography>
              <Typography><b>Amount:</b> {selectedLoad.amount}</Typography>
              <Typography><b>Status:</b> {selectedLoad.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(17, 17, 17, 0.95)',
            color: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>
          Chat with Vendor
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: '300px', overflowY: 'auto', mb: 2 }}>
            {chatHistory.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'driver' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    maxWidth: '70%',
                    background: msg.sender === 'driver' ? 'rgba(67,233,123,0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleString() : ''}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#43e97b',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#43e97b',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setChatOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleSendChat}
            variant="contained"
            sx={{
              background: '#43e97b',
              '&:hover': {
                background: '#38f9d7',
              },
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
      />
    </Box>
  );
};

export default AvailableLoads; 