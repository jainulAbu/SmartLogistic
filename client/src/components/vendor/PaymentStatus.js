import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import ChatComponent from '../chat/ChatComponent';

const PaymentStatus = ({ delivery }) => {
  const [paymentStatus, setPaymentStatus] = useState(delivery.paymentStatus || 'pending');
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const { currentUser } = useAuth();
  const db = getFirestore();

  const handlePaymentStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'loads', delivery.id), {
        paymentStatus: newStatus,
        paymentUpdatedAt: serverTimestamp(),
        paymentNote: paymentNote,
      });

      // Add payment status message to chat
      await addDoc(collection(db, 'chats'), {
        loadId: delivery.id,
        vendorId: currentUser.uid,
        driverId: delivery.driverId,
        senderId: currentUser.uid,
        senderRole: 'vendor',
        content: `Payment status updated to: ${newStatus}${paymentNote ? ` - ${paymentNote}` : ''}`,
        createdAt: serverTimestamp(),
        type: 'payment_update',
      });

      setPaymentStatus(newStatus);
      setPaymentDialog(false);
      setPaymentNote('');
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'disputed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleIcon />;
      case 'pending': return <PendingIcon />;
      case 'disputed': return <PaymentIcon />;
      default: return <PaymentIcon />;
    }
  };

  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Payment Status</Typography>
            <Chip
              icon={getStatusIcon(paymentStatus)}
              label={paymentStatus.toUpperCase()}
              color={getStatusColor(paymentStatus)}
            />
          </Box>

          <Typography variant="body1" gutterBottom>
            Amount: ${delivery.driverBid || delivery.price}
          </Typography>

          {delivery.paymentNote && (
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Note: {delivery.paymentNote}
            </Typography>
          )}

          <Box mt={2} display="flex" gap={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPaymentDialog(true)}
              startIcon={<PaymentIcon />}
            >
              Update Payment
            </Button>
            <Button
              variant="outlined"
              onClick={() => setChatOpen(true)}
            >
              Discuss Payment
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Payment Status Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)}>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Payment Note"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="Add any notes about the payment status..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handlePaymentStatusChange('paid')}
            color="success"
            disabled={loading}
          >
            Mark as Paid
          </Button>
          <Button
            onClick={() => handlePaymentStatusChange('disputed')}
            color="error"
            disabled={loading}
          >
            Mark as Disputed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Payment Discussion</DialogTitle>
        <DialogContent>
          <ChatComponent
            loadId={delivery.id}
            vendorId={currentUser.uid}
            driverId={delivery.driverId}
            open={chatOpen}
            onClose={() => setChatOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentStatus; 