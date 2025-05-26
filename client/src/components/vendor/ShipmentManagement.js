import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Chat as ChatIcon,
  History as HistoryIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ShipmentManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [newShipment, setNewShipment] = useState({
    pickupLocation: '',
    deliveryLocation: '',
    goodsType: '',
    weight: '',
    dimensions: '',
    specialInstructions: '',
    preferredVehicleType: '',
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const userId = auth.currentUser.uid;
      
      switch (activeTab) {
        case 0: // Track Bookings
          const shipmentsQuery = query(
            collection(db, 'shipments'),
            where('vendorId', '==', userId)
          );
          const shipmentsSnapshot = await getDocs(shipmentsQuery);
          setShipments(shipmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })));
          break;
        
        case 2: // Chat
          const chatQuery = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', userId)
          );
          const chatSnapshot = await getDocs(chatQuery);
          setChatMessages(chatSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })));
          break;
        
        case 3: // Price History
          const priceQuery = query(
            collection(db, 'priceHistory'),
            where('vendorId', '==', userId)
          );
          const priceSnapshot = await getDocs(priceQuery);
          setPriceHistory(priceSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })));
          break;
        
        case 4: // Invoice History
          const invoiceQuery = query(
            collection(db, 'invoices'),
            where('vendorId', '==', userId)
          );
          const invoiceSnapshot = await getDocs(invoiceQuery);
          setInvoices(invoiceSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })));
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmitShipment = async () => {
    try {
      const shipmentData = {
        ...newShipment,
        vendorId: auth.currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
        bids: [],
      };
      
      await addDoc(collection(db, 'shipments'), shipmentData);
      setOpenDialog(false);
      setNewShipment({
        pickupLocation: '',
        deliveryLocation: '',
        goodsType: '',
        weight: '',
        dimensions: '',
        specialInstructions: '',
        preferredVehicleType: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab icon={<ShippingIcon />} label="Track Bookings" />
                  <Tab icon={<AddIcon />} label="Post Shipment" />
                  <Tab icon={<ChatIcon />} label="Chat" />
                  <Tab icon={<MoneyIcon />} label="Price History" />
                  <Tab icon={<HistoryIcon />} label="Invoice History" />
                </Tabs>
              </Box>

              {/* Track Bookings Tab */}
              {activeTab === 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Shipment ID</TableCell>
                        <TableCell>Pickup</TableCell>
                        <TableCell>Delivery</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Driver</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell>{shipment.id}</TableCell>
                          <TableCell>{shipment.pickupLocation}</TableCell>
                          <TableCell>{shipment.deliveryLocation}</TableCell>
                          <TableCell>
                            <Chip
                              label={shipment.status}
                              color={
                                shipment.status === 'completed' ? 'success' :
                                shipment.status === 'in-progress' ? 'primary' :
                                'warning'
                              }
                            />
                          </TableCell>
                          <TableCell>{shipment.driverName || 'Not Assigned'}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {/* Handle view details */}}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Post Shipment Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                  >
                    New Shipment Request
                  </Button>
                </Box>
              )}

              {/* Chat Tab */}
              {activeTab === 2 && (
                <Box sx={{ p: 2 }}>
                  {chatMessages.map((chat) => (
                    <Card key={chat.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{chat.driverName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {chat.lastMessage}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(chat.lastMessageTime?.toDate()).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Price History Tab */}
              {activeTab === 3 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Route</TableCell>
                        <TableCell>Vehicle Type</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {priceHistory.map((price) => (
                        <TableRow key={price.id}>
                          <TableCell>{new Date(price.date?.toDate()).toLocaleDateString()}</TableCell>
                          <TableCell>{price.route}</TableCell>
                          <TableCell>{price.vehicleType}</TableCell>
                          <TableCell>₹{price.amount}</TableCell>
                          <TableCell>
                            <Chip
                              label={price.status}
                              color={price.status === 'accepted' ? 'success' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Invoice History Tab */}
              {activeTab === 4 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoiceNumber}</TableCell>
                          <TableCell>{new Date(invoice.date?.toDate()).toLocaleDateString()}</TableCell>
                          <TableCell>₹{invoice.amount}</TableCell>
                          <TableCell>
                            <Chip
                              label={invoice.status}
                              color={invoice.status === 'paid' ? 'success' : 'warning'}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {/* Handle download invoice */}}
                            >
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* New Shipment Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>New Shipment Request</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pickup Location"
                  value={newShipment.pickupLocation}
                  onChange={(e) => setNewShipment({ ...newShipment, pickupLocation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Delivery Location"
                  value={newShipment.deliveryLocation}
                  onChange={(e) => setNewShipment({ ...newShipment, deliveryLocation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Type of Goods"
                  value={newShipment.goodsType}
                  onChange={(e) => setNewShipment({ ...newShipment, goodsType: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={newShipment.weight}
                  onChange={(e) => setNewShipment({ ...newShipment, weight: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dimensions (L x W x H)"
                  value={newShipment.dimensions}
                  onChange={(e) => setNewShipment({ ...newShipment, dimensions: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Vehicle Type</InputLabel>
                  <Select
                    value={newShipment.preferredVehicleType}
                    onChange={(e) => setNewShipment({ ...newShipment, preferredVehicleType: e.target.value })}
                    label="Preferred Vehicle Type"
                  >
                    <MenuItem value="lorry">Lorry</MenuItem>
                    <MenuItem value="miniTruck">Mini Truck</MenuItem>
                    <MenuItem value="truck">Truck</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Special Instructions"
                  value={newShipment.specialInstructions}
                  onChange={(e) => setNewShipment({ ...newShipment, specialInstructions: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitShipment} variant="contained">
              Submit Request
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default ShipmentManagement; 