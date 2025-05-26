import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  AccessTime,
  Error,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import AppBackground from '../layout/AppBackground';
import VendorNavbar from '../layout/VendorNavbar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const ActiveDeliveries = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!currentUser) return;

    const deliveriesRef = collection(db, 'deliveries');
    const q = query(
      deliveriesRef,
      where('vendorId', '==', currentUser.uid),
      where('status', 'in', ['pending', 'in_transit'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deliveries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActiveDeliveries(deliveries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, db]);

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setDetailsOpen(true);
  };

  const handleChatOpen = (delivery) => {
    setSelectedDelivery(delivery);
    setChatOpen(true);
    // Fetch chat history here
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setSelectedDelivery(null);
    setMessage('');
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post('/api/vendor/send-message', {
        deliveryId: selectedDelivery.id,
        message: message.trim()
      });
      setChatMessages([...chatMessages, { sender: 'vendor', message: message.trim() }]);
      setMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'in_transit':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AccessTime sx={{ color: '#ff9800' }} />;
      case 'in_transit':
        return <LocalShippingIcon sx={{ color: '#4caf50' }} />;
      default:
        return <Error sx={{ color: '#757575' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <LinearProgress sx={{ 
          height: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#4caf50'
          }
        }} />
      </Box>
    );
  }

  return (
    <AppBackground>
      <VendorNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/vendor-dashboard')} 
          sx={{ mb: 2, color: '#43e97b', background: 'rgba(67,233,123,0.08)', borderRadius: 2 }}
        >
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </IconButton>

        <Paper sx={{ p: 3, background: '#23272f', color: '#fff' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Active Deliveries
          </Typography>
          <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                background: 'rgba(211, 47, 47, 0.1)',
                color: '#ff6b6b',
                border: '1px solid rgba(211, 47, 47, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {activeDeliveries.length === 0 ? (
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2
            }}>
              <Typography variant="h6" sx={{ color: '#fff', opacity: 0.7 }}>
                No active deliveries at the moment
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {activeDeliveries.map((delivery) => (
                <Grid item xs={12} md={6} lg={4} key={delivery.id}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      borderColor: '#4caf50'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                          Order #{delivery.orderId}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(delivery.status)}
                          label={delivery.status.replace('_', ' ').toUpperCase()}
                          sx={{
                            backgroundColor: `${getStatusColor(delivery.status)}20`,
                            color: getStatusColor(delivery.status),
                            border: `1px solid ${getStatusColor(delivery.status)}40`,
                            '& .MuiChip-icon': {
                              color: 'inherit'
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#fff', opacity: 0.7, mb: 1 }}>
                          From:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                          <Typography variant="body1" sx={{ color: '#fff' }}>
                            {delivery.pickupAddress}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#fff', opacity: 0.7, mb: 1 }}>
                          To:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                          <Typography variant="body1" sx={{ color: '#fff' }}>
                            {delivery.deliveryAddress}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#fff', opacity: 0.7 }}>
                          Driver: {delivery.driverName || 'Not assigned'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', opacity: 0.7 }}>
                          {delivery.createdAt && delivery.createdAt.toDate ? new Date(delivery.createdAt.toDate()).toLocaleDateString() : ''}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Delivery Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: '#23272f',
              color: '#fff',
            },
          }}
        >
          {selectedDelivery && (
            <>
              <DialogTitle>
                Delivery Details
                <Chip
                  label={selectedDelivery.status}
                  color={getStatusColor(selectedDelivery.status)}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Route Information
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    From: {selectedDelivery.pickupLocation}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    To: {selectedDelivery.deliveryLocation}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
                    Delivery Details
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Goods Type: {selectedDelivery.goodsType}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Weight: {selectedDelivery.weight}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Price: ${selectedDelivery.price}
                  </Typography>

                  <Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
                    Tracking History
                  </Typography>
                  <List>
                    {selectedDelivery.trackingHistory?.map((tracking, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={tracking.location}
                          secondary={
                            <>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Status: {tracking.status}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Time: {tracking.timestamp.toDate().toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsOpen(false)} sx={{ color: '#43e97b' }}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Chat Dialog */}
        <Dialog 
          open={chatOpen} 
          onClose={handleChatClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            pb: 2
          }}>
            Chat with Driver
            <IconButton
              onClick={handleChatClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#fff',
                  transform: 'rotate(90deg)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ 
              height: 300, 
              overflowY: 'auto',
              mb: 2,
              p: 2,
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 1
            }}>
              {chatMessages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === 'vendor' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 2,
                      background: msg.sender === 'vendor' ? '#4caf50' : 'rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    }}
                  >
                    <Typography variant="body1">{msg.message}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#4caf50'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50'
                    }
                  }
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                sx={{
                  background: '#4caf50',
                  color: '#fff',
                  '&:hover': {
                    background: '#45a049',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </AppBackground>
  );
};

export default ActiveDeliveries; 