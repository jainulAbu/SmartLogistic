import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Chat as ChatIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import ChatComponent from '../chat/ChatComponent';
import PaymentStatus from './PaymentStatus';
import { saveAs } from 'file-saver';

const DeliveryList = ({ type = 'active', extraComponent }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [search, setSearch] = useState('');
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchDeliveries();
  }, [type]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      let status;
      if (type === 'active') {
        status = ['pending', 'in-progress', 'accepted'];
      } else if (type === 'completed') {
        status = ['completed'];
      } else if (type === 'rejected') {
        status = ['rejected'];
      } else if (type === 'pending') {
        status = ['pending'];
      } else {
        status = ['pending', 'in-progress', 'accepted', 'completed', 'rejected'];
      }
      const deliveriesQuery = query(
        collection(db, 'loads'),
        where('vendorId', '==', currentUser.uid),
        where('status', 'in', status)
      );
      const querySnapshot = await getDocs(deliveriesQuery);
      const deliveriesData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          let driverData = null;
          if (data.driverId) {
            const driverDoc = await getDoc(doc.ref.firestore.doc('drivers/' + data.driverId));
            if (driverDoc.exists()) {
              driverData = driverDoc.data();
            }
          }
          return {
            id: doc.id,
            ...data,
            driver: driverData,
          };
        })
      );
      setDeliveries(deliveriesData);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  // Filtering and searching
  const filteredDeliveries = deliveries.filter(delivery => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      delivery.goodsType?.toLowerCase().includes(s) ||
      delivery.pickupLocation?.toLowerCase().includes(s) ||
      delivery.deliveryLocation?.toLowerCase().includes(s) ||
      delivery.driver?.name?.toLowerCase().includes(s) ||
      delivery.id?.toLowerCase().includes(s)
    );
  });

  // Summary stats
  const total = deliveries.length;
  const paid = deliveries.filter(d => d.paymentStatus === 'paid').length;
  const pending = deliveries.filter(d => d.paymentStatus === 'pending').length;
  const disputed = deliveries.filter(d => d.paymentStatus === 'disputed').length;
  const totalEarnings = deliveries.reduce((sum, d) => sum + (parseFloat(d.driverBid || d.price) || 0), 0);

  const handleOpenChat = (delivery) => {
    setSelectedDelivery(delivery);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedDelivery(null);
  };

  const handleAcceptBid = async (delivery) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'loads', delivery.id), {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        acceptedBy: currentUser.uid,
      });

      // Add acceptance message to chat
      await addDoc(collection(db, 'chats'), {
        loadId: delivery.id,
        vendorId: currentUser.uid,
        driverId: delivery.driverId,
        senderId: currentUser.uid,
        senderRole: 'vendor',
        content: `Load accepted with bid amount: $${delivery.driverBid}`,
        createdAt: serverTimestamp(),
        type: 'acceptance',
      });

      // Refresh deliveries
      await fetchDeliveries();
    } catch (error) {
      console.error('Error accepting bid:', error);
      setError('Failed to accept bid');
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  const handleRejectBid = async (delivery) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'loads', delivery.id), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: currentUser.uid,
      });

      // Add rejection message to chat
      await addDoc(collection(db, 'chats'), {
        loadId: delivery.id,
        vendorId: currentUser.uid,
        driverId: delivery.driverId,
        senderId: currentUser.uid,
        senderRole: 'vendor',
        content: 'Load bid rejected',
        createdAt: serverTimestamp(),
        type: 'rejection',
      });

      // Refresh deliveries
      await fetchDeliveries();
    } catch (error) {
      console.error('Error rejecting bid:', error);
      setError('Failed to reject bid');
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      case 'completed': return 'success';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  // Export CSV feature
  const handleExportCSV = () => {
    const headers = ['ID', 'Goods', 'From', 'To', 'Driver', 'Status', 'Payment', 'Earnings'];
    const rows = filteredDeliveries.map(d => [
      d.id,
      d.goodsType,
      d.pickupLocation,
      d.deliveryLocation,
      d.driver?.name || '',
      d.status,
      d.paymentStatus,
      d.driverBid || d.price
    ]);
    const csv = [headers, ...rows].map(r => r.map(x => `"${(x ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'deliveries.csv');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {/* Export CSV Button */}
      <Button onClick={handleExportCSV} variant="outlined" sx={{ mb: 2 }}>
        Export CSV
      </Button>
      {/* Summary Stats */}
      <Box mb={3} display="flex" gap={3} flexWrap="wrap">
        <Chip label={`Total: ${total}`} color="primary" />
        <Chip label={`Paid: ${paid}`} color="success" />
        <Chip label={`Pending: ${pending}`} color="warning" />
        <Chip label={`Disputed: ${disputed}`} color="error" />
        <Chip label={`Earnings: $${totalEarnings}`} color="info" />
      </Box>
      {/* Search Bar */}
      <Box mb={2} display="flex" alignItems="center" gap={1}>
        <SearchIcon />
        <TextField
          size="small"
          placeholder="Search by goods, location, driver, or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 1, input: { color: '#fff' } }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredDeliveries.map((delivery) => (
          <Grid item xs={12} md={6} lg={4} key={delivery.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {delivery.goodsType}
                  </Typography>
                  <Chip
                    label={delivery.status?.toUpperCase()}
                    color={getStatusColor(delivery.status)}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  From: {delivery.pickupLocation}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  To: {delivery.deliveryLocation}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Weight: {delivery.weight} tons
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Base Price: ${delivery.price}
                </Typography>
                {delivery.driverBid && (
                  <Typography variant="body2" color="primary" gutterBottom>
                    Driver's Bid: ${delivery.driverBid}
                  </Typography>
                )}
                {delivery.driver && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Driver Details:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={delivery.driver.vehicleImageUrl}
                        alt={delivery.driver.name}
                      />
                      <Box>
                        <Typography variant="body2">
                          {delivery.driver.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {delivery.driver.vehicleType} - {delivery.driver.vehicleNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                {delivery.specialInstructions && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Instructions: {delivery.specialInstructions}
                  </Typography>
                )}
                <Divider sx={{ my: 2 }} />
                {/* Payment Status Section */}
                {extraComponent ? React.createElement(extraComponent, { delivery }) : <PaymentStatus delivery={delivery} />}
                {/* Action Buttons */}
                {delivery.status === 'pending' && delivery.driverBid && (
                  <Box mt={2} display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={() => {
                        setSelectedDelivery(delivery);
                        setConfirmDialog(true);
                      }}
                      fullWidth
                    >
                      Accept Bid
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        setSelectedDelivery(delivery);
                        setConfirmDialog(true);
                      }}
                      fullWidth
                    >
                      Reject Bid
                    </Button>
                  </Box>
                )}
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  startIcon={<ChatIcon />}
                  onClick={() => handleOpenChat(delivery)}
                  variant="outlined"
                  fullWidth
                >
                  Chat with Driver
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={handleCloseChat}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chat with Driver - {selectedDelivery?.goodsType}
        </DialogTitle>
        <DialogContent>
          {selectedDelivery && (
            <ChatComponent
              loadId={selectedDelivery.id}
              vendorId={currentUser.uid}
              driverId={selectedDelivery.driverId}
              open={chatOpen}
              onClose={handleCloseChat}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChat}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedDelivery?.status === 'pending' ? 'accept' : 'reject'} this bid?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          {selectedDelivery?.status === 'pending' ? (
            <Button
              onClick={() => handleAcceptBid(selectedDelivery)}
              color="success"
              variant="contained"
            >
              Accept
            </Button>
          ) : (
            <Button
              onClick={() => handleRejectBid(selectedDelivery)}
              color="error"
              variant="contained"
            >
              Reject
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryList; 