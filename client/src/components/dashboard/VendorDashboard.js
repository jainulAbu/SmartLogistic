import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  LocalShipping as ShippingIcon,
  Chat as ChatIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  BarChart as BarChartIcon,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';

const VendorDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    completed: 0,
    totalEarnings: 0,
    acceptedBids: 0,
    rejectedBids: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newLocation, setNewLocation] = useState({
    location: '',
    status: '',
    notes: ''
  });
  const [newShipment, setNewShipment] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    goodsType: '',
    weight: '',
    price: '',
    description: '',
    bidAmount: '',
    pickupDate: '',
    deliveryDate: '',
    specialInstructions: '',
    status: 'pending',
    acceptedBids: [],
    rejectedBids: []
  });
  const navigate = useNavigate();
  const db = getFirestore();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchShipments();
    }
  }, [currentUser]);

  const fetchShipments = async () => {
    try {
      const shipmentsQuery = query(
        collection(db, 'shipments'),
        where('vendorId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(shipmentsQuery);
      const shipmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShipments(shipmentsData);

      // Calculate statistics
      const stats = {
        active: 0,
        pending: 0,
        completed: 0,
        totalEarnings: 0,
        acceptedBids: 0,
        rejectedBids: 0
      };

      shipmentsData.forEach(shipment => {
        // Count status
        stats[shipment.status]++;
        
        // Count bids
        if (shipment.acceptedBids) {
          stats.acceptedBids += shipment.acceptedBids.length;
        }
        if (shipment.rejectedBids) {
          stats.rejectedBids += shipment.rejectedBids.length;
        }

        // Calculate earnings for completed shipments
        if (shipment.status === 'completed' && shipment.price) {
          stats.totalEarnings += parseFloat(shipment.price);
        }
      });

      setStats(stats);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };

  const handleUpdateLocation = async () => {
    if (!selectedShipment || !newLocation.location) return;

    try {
      const shipmentRef = doc(db, 'shipments', selectedShipment.id);
      await updateDoc(shipmentRef, {
        currentLocation: newLocation.location,
        trackingHistory: arrayUnion({
          location: newLocation.location,
          status: newLocation.status,
          notes: newLocation.notes,
          timestamp: new Date()
        })
      });

      setOpenLocationDialog(false);
      setNewLocation({ location: '', status: '', notes: '' });
      fetchShipments();
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleNewShipment = async () => {
    try {
      await addDoc(collection(db, 'shipments'), {
        ...newShipment,
        vendorId: currentUser.uid,
        vendorName: currentUser.name,
        status: 'pending',
        createdAt: new Date(),
        acceptedBids: [],
        rejectedBids: [],
        currentLocation: newShipment.pickupLocation,
        trackingHistory: [{
          location: newShipment.pickupLocation,
          timestamp: new Date(),
          status: 'pending'
        }]
      });
      setOpenDialog(false);
      setNewShipment({
        pickupLocation: '',
        deliveryLocation: '',
        goodsType: '',
        weight: '',
        price: '',
        description: '',
        bidAmount: '',
        pickupDate: '',
        deliveryDate: '',
        specialInstructions: '',
        status: 'pending',
        acceptedBids: [],
        rejectedBids: []
      });
      fetchShipments();
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  // Example chart data (replace with real data)
  const deliveriesPerMonth = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Deliveries', data: [3, 5, 2, 8, 6, 7], backgroundColor: '#1976d2' }]
  };
  const statusPie = {
    labels: ['Active', 'Completed', 'Rejected'],
    datasets: [{ data: [3, 12, 2], backgroundColor: ['#ffa726', '#66bb6a', '#ef5350'] }]
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" fontWeight={700}>Vendor Dashboard</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Add Item Delivery
        </Button>
      </Box>

      {/* Stats & Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ShippingIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h5">{stats.active}</Typography>
              </Box>
              <Typography color="textSecondary">Active Deliveries</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h5">{stats.completed}</Typography>
              </Box>
              <Typography color="textSecondary">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Cancel color="error" sx={{ mr: 1 }} />
                <Typography variant="h5">{stats.rejectedBids}</Typography>
              </Box>
              <Typography color="textSecondary">Rejected</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Bar data={deliveriesPerMonth} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pie Chart for Status */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Status Breakdown</Typography>
          <Pie data={statusPie} />
        </Paper>
      </Box>

      {/* Shipments Table/List */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>All Shipments</Typography>
          {/* Replace below with a Table or List as needed */}
          <List>
            {shipments.map((shipment) => (
              <React.Fragment key={shipment.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton onClick={() => navigate(`/chat/${shipment.id}`)}><ChatIcon /></IconButton>
                      <IconButton onClick={() => navigate(`/booking-summary/${shipment.id}`)}><HistoryIcon /></IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${shipment.pickupLocation} → ${shipment.deliveryLocation}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">Status: {shipment.status}</Typography>
                        <Typography variant="body2">Driver: {shipment.driverName || 'Not assigned'}</Typography>
                        <Typography variant="body2">Last Updated: {shipment.trackingHistory?.[shipment.trackingHistory.length - 1]?.timestamp?.toDate().toLocaleString() || 'N/A'}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Location Update Dialog */}
      <Dialog open={openLocationDialog} onClose={() => setOpenLocationDialog(false)}>
        <DialogTitle>Update Shipment Location</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Current Location"
              value={newLocation.location}
              onChange={(e) => setNewLocation({ ...newLocation, location: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={newLocation.status}
                onChange={(e) => setNewLocation({ ...newLocation, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="picked up">Picked Up</MenuItem>
                <MenuItem value="in transit">In Transit</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="delayed">Delayed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={newLocation.notes}
              onChange={(e) => setNewLocation({ ...newLocation, notes: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLocationDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateLocation} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Shipment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Shipment</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Pickup Location (From)"
              value={newShipment.pickupLocation}
              onChange={(e) => setNewShipment({ ...newShipment, pickupLocation: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Drop Location (To)"
              value={newShipment.deliveryLocation}
              onChange={(e) => setNewShipment({ ...newShipment, deliveryLocation: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type of Goods</InputLabel>
              <Select
                value={newShipment.goodsType}
                onChange={(e) => setNewShipment({ ...newShipment, goodsType: e.target.value })}
                label="Type of Goods"
                required
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="perishable">Perishable</MenuItem>
                <MenuItem value="hazardous">Hazardous</MenuItem>
                <MenuItem value="fragile">Fragile</MenuItem>
                <MenuItem value="bulk">Bulk</MenuItem>
                <MenuItem value="liquid">Liquid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              value={newShipment.weight}
              onChange={(e) => setNewShipment({ ...newShipment, weight: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Base Price (₹)"
              type="number"
              value={newShipment.price}
              onChange={(e) => setNewShipment({ ...newShipment, price: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Minimum Bid Amount (₹)"
              type="number"
              value={newShipment.bidAmount}
              onChange={(e) => setNewShipment({ ...newShipment, bidAmount: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Pickup Date"
              type="datetime-local"
              value={newShipment.pickupDate}
              onChange={(e) => setNewShipment({ ...newShipment, pickupDate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Delivery Date"
              type="datetime-local"
              value={newShipment.deliveryDate}
              onChange={(e) => setNewShipment({ ...newShipment, deliveryDate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newShipment.description}
              onChange={(e) => setNewShipment({ ...newShipment, description: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Instructions for Driver"
              multiline
              rows={2}
              value={newShipment.specialInstructions}
              onChange={(e) => setNewShipment({ ...newShipment, specialInstructions: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleNewShipment} variant="contained">
            Create Shipment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VendorDashboard; 