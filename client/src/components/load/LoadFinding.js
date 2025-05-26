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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Rating,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  LocalShipping as TruckIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useAuth } from '../../contexts/AuthContext';

const LoadFinding = () => {
  const [loads, setLoads] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const [availableDrivers, setAvailableDrivers] = useState([]);

  const [formData, setFormData] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    goodsType: '',
    weight: '',
    dimensions: '',
    specialInstructions: '',
    preferredVehicleType: '',
    price: '',
    urgency: 'normal',
    status: 'open',
  });

  const db = getFirestore();

  useEffect(() => {
    fetchLoads();
    fetchAvailableDrivers();
  }, []);

  const fetchLoads = async () => {
    try {
      setLoading(true);
      const loadsQuery = query(
        collection(db, 'loads'),
        where('vendorId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(loadsQuery);
      const loadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoads(loadsData);
    } catch (error) {
      console.error('Error fetching loads:', error);
      setError('Failed to fetch loads');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      const driversQuery = query(
        collection(db, 'drivers'),
        where('isOnline', '==', true)
      );
      const snapshot = await getDocs(driversQuery);
      const driversData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableDrivers(driversData);
    } catch (error) {
      console.error('Error fetching available drivers:', error);
    }
  };

  const handleOpenDialog = (load = null) => {
    if (load) {
      setSelectedLoad(load);
      setFormData(load);
    } else {
      setSelectedLoad(null);
      setFormData({
        pickupLocation: '',
        deliveryLocation: '',
        goodsType: '',
        weight: '',
        dimensions: '',
        specialInstructions: '',
        preferredVehicleType: '',
        price: '',
        urgency: 'normal',
        status: 'open',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLoad(null);
    setFormData({
      pickupLocation: '',
      deliveryLocation: '',
      goodsType: '',
      weight: '',
      dimensions: '',
      specialInstructions: '',
      preferredVehicleType: '',
      price: '',
      urgency: 'normal',
      status: 'open',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const loadData = {
        ...formData,
        vendorId: currentUser.uid,
        updatedAt: serverTimestamp(),
      };

      if (selectedLoad) {
        // Update existing load
        await updateDoc(doc(db, 'loads', selectedLoad.id), loadData);
      } else {
        // Add new load
        loadData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'loads'), loadData);
      }

      handleCloseDialog();
      fetchLoads();
    } catch (error) {
      console.error('Error saving load:', error);
      setError('Failed to save load');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (loadId) => {
    if (window.confirm('Are you sure you want to delete this load?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, 'loads', loadId));
        fetchLoads();
      } catch (error) {
        console.error('Error deleting load:', error);
        setError('Failed to delete load');
      } finally {
        setLoading(false);
      }
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Load Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add New Load
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Drivers ({availableDrivers.length})
            </Typography>
            <Grid container spacing={3}>
              {availableDrivers.map((driver) => (
                <Grid item xs={12} md={6} lg={4} key={driver.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {driver.name}
                        </Typography>
                        <Chip
                          label="Online"
                          color="success"
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Vehicle Type: {driver.vehicleType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Rating: {driver.rating || 'New'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Completed Trips: {driver.completedTrips || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            {loads.map((load) => (
              <Grid item xs={12} md={6} lg={4} key={load.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {load.goodsType}
                      </Typography>
                      <Box>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(load)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(load.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      From: {load.pickupLocation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      To: {load.deliveryLocation}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Weight: {load.weight}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Dimensions: {load.dimensions}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Price: ₹{load.price}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={load.status}
                        color={
                          load.status === 'open' ? 'success' :
                          load.status === 'in-progress' ? 'warning' :
                          'error'
                        }
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={load.urgency}
                        color={
                          load.urgency === 'urgent' ? 'error' :
                          load.urgency === 'normal' ? 'primary' :
                          'default'
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Add/Edit Load Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedLoad ? 'Edit Load' : 'Add New Load'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pickup Location"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Delivery Location"
                  value={formData.deliveryLocation}
                  onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type of Goods</InputLabel>
                  <Select
                    value={formData.goodsType}
                    onChange={(e) => setFormData({ ...formData, goodsType: e.target.value })}
                    label="Type of Goods"
                    required
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="perishable">Perishable</MenuItem>
                    <MenuItem value="hazardous">Hazardous</MenuItem>
                    <MenuItem value="fragile">Fragile</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Vehicle Type</InputLabel>
                  <Select
                    value={formData.preferredVehicleType}
                    onChange={(e) => setFormData({ ...formData, preferredVehicleType: e.target.value })}
                    label="Preferred Vehicle Type"
                    required
                  >
                    <MenuItem value="lorry">Lorry</MenuItem>
                    <MenuItem value="miniTruck">Mini Truck</MenuItem>
                    <MenuItem value="truck">Truck</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Urgency</InputLabel>
                  <Select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    label="Urgency"
                  >
                    <MenuItem value="urgent">Urgent</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Special Instructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : selectedLoad ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoadFinding; 