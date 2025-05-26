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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import AppBackground from '../layout/AppBackground';
import VendorNavbar from '../layout/VendorNavbar';

const PendingDeliveries = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const deliveriesQuery = query(
      collection(db, 'shipments'),
      where('vendorId', '==', currentUser.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(deliveriesQuery, (snapshot) => {
      const deliveries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingDeliveries(deliveries);
    });

    return () => unsubscribe();
  }, [currentUser.uid, db]);

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setDetailsOpen(true);
  };

  const handleAcceptDelivery = async (deliveryId) => {
    // Implement accept delivery logic
    console.log('Accept delivery:', deliveryId);
  };

  const handleRejectDelivery = async (deliveryId) => {
    // Implement reject delivery logic
    console.log('Reject delivery:', deliveryId);
  };

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
            Pending Deliveries
          </Typography>
          <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

          <List>
            {pendingDeliveries.map((delivery) => (
              <React.Fragment key={delivery.id}>
                <ListItem
                  sx={{
                    mb: 2,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.08)',
                    },
                  }}
                  secondaryAction={
                    <Box>
                      <IconButton onClick={() => navigate(`/vendor-dashboard/delivery-details/${delivery.id}`)}>
                        <LocationIcon sx={{ color: '#43e97b' }} />
                      </IconButton>
                      <IconButton onClick={() => navigate(`/vendor-dashboard/chat/${delivery.id}`)}>
                        <ChatIcon sx={{ color: '#43e97b' }} />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          {delivery.pickupLocation} → {delivery.deliveryLocation}
                        </Typography>
                        <Chip
                          label={delivery.status}
                          color="warning"
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Requested Time: {delivery.requestedTime?.toDate().toLocaleString() || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Goods Type: {delivery.goodsType}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetails(delivery)}
                            sx={{ color: '#43e97b', borderColor: '#43e97b' }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleAcceptDelivery(delivery.id)}
                            sx={{ 
                              background: '#43e97b',
                              '&:hover': {
                                background: '#2ed573',
                              },
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => handleRejectDelivery(delivery.id)}
                            sx={{ color: '#ff6b6b', borderColor: '#ff6b6b' }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
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
                  color="warning"
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
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Requested Time: {selectedDelivery.requestedTime?.toDate().toLocaleString() || 'N/A'}
                  </Typography>

                  <Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
                    Special Instructions
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedDelivery.specialInstructions || 'No special instructions'}
                  </Typography>
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
      </Container>
    </AppBackground>
  );
};

export default PendingDeliveries; 