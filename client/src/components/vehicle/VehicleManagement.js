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
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    type: '',
    model: '',
    registrationNumber: '',
    capacity: '',
    documents: {
      rcBook: '',
      insurance: '',
      permit: '',
    },
    status: 'available',
    returnLoadAvailable: false,
  });
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const vehiclesQuery = query(
        collection(db, 'vehicles'),
        where('ownerId', '==', userId)
      );
      const querySnapshot = await getDocs(vehiclesQuery);
      const vehiclesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await addDoc(collection(db, 'vehicles'), {
        ...newVehicle,
        ownerId: userId,
        createdAt: new Date(),
      });
      setOpenDialog(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleUpdateVehicle = async () => {
    try {
      await updateDoc(doc(db, 'vehicles', selectedVehicle.id), {
        ...newVehicle,
        updatedAt: new Date(),
      });
      setOpenDialog(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteDoc(doc(db, 'vehicles', vehicleId));
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleDocumentUpload = async (file, documentType) => {
    try {
      setUploadingDoc(true);
      const userId = localStorage.getItem('userId');
      const storageRef = ref(storage, `documents/${userId}/${documentType}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setNewVehicle(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentType]: downloadURL,
        },
      }));
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploadingDoc(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Vehicle Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedVehicle(null);
                setNewVehicle({
                  type: '',
                  model: '',
                  registrationNumber: '',
                  capacity: '',
                  documents: {
                    rcBook: '',
                    insurance: '',
                    permit: '',
                  },
                  status: 'available',
                  returnLoadAvailable: false,
                });
                setOpenDialog(true);
              }}
            >
              Add Vehicle
            </Button>
          </Paper>
        </Grid>

        {/* Vehicle List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <List>
              {vehicles.map((vehicle) => (
                <React.Fragment key={vehicle.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setNewVehicle(vehicle);
                            setOpenDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteVehicle(vehicle.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={`${vehicle.type} - ${vehicle.model}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Registration: {vehicle.registrationNumber}
                          </Typography>
                          <Typography variant="body2">
                            Capacity: {vehicle.capacity} tons
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              size="small"
                              label={vehicle.status}
                              color={vehicle.status === 'available' ? 'success' : 'warning'}
                              sx={{ mr: 1 }}
                            />
                            {vehicle.returnLoadAvailable && (
                              <Chip
                                size="small"
                                label="Return Load Available"
                                color="primary"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit Vehicle Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                label="Vehicle Type"
              >
                <MenuItem value="lorry">Lorry</MenuItem>
                <MenuItem value="miniTruck">Mini Truck</MenuItem>
                <MenuItem value="truck">Truck</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Model"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Registration Number"
              value={newVehicle.registrationNumber}
              onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Capacity (tons)"
              type="number"
              value={newVehicle.capacity}
              onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={newVehicle.status}
                onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="inUse">In Use</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={newVehicle.returnLoadAvailable}
                  onChange={(e) => setNewVehicle({ ...newVehicle, returnLoadAvailable: e.target.checked })}
                />
              }
              label="Return Load Available"
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Documents
              </Typography>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                component="label"
                disabled={uploadingDoc}
                sx={{ mr: 1 }}
              >
                Upload RC Book
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleDocumentUpload(e.target.files[0], 'rcBook')}
                />
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                component="label"
                disabled={uploadingDoc}
                sx={{ mr: 1 }}
              >
                Upload Insurance
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleDocumentUpload(e.target.files[0], 'insurance')}
                />
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                component="label"
                disabled={uploadingDoc}
              >
                Upload Permit
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleDocumentUpload(e.target.files[0], 'permit')}
                />
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={selectedVehicle ? handleUpdateVehicle : handleAddVehicle}
            variant="contained"
          >
            {selectedVehicle ? 'Update' : 'Add'} Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehicleManagement; 