import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Checkbox, FormControlLabel, Grid, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const VendorShipments = () => {
  const { currentUser } = useAuth();
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [vendorName, setVendorName] = useState('');
  const [loadInfo, setLoadInfo] = useState('');
  const [amount, setAmount] = useState('');
  const [isReturnLoad, setIsReturnLoad] = useState(false);
  const [returnLoadName, setReturnLoadName] = useState('');
  const [returnLoadInfo, setReturnLoadInfo] = useState('');
  const [returnAmount, setReturnAmount] = useState('');
  const [notificationSent, setNotificationSent] = useState(false);
  const [driverAccepted, setDriverAccepted] = useState(false);
  const [error, setError] = useState('');

  // New Goods Dialog State
  const [newGoodsDialogOpen, setNewGoodsDialogOpen] = useState(false);
  const [goodsName, setGoodsName] = useState('');
  const [goodsLocation, setGoodsLocation] = useState('');
  const [goodsDate, setGoodsDate] = useState('');
  const [goodsTime, setGoodsTime] = useState('');
  const [goodsAmount, setGoodsAmount] = useState('');
  const [goodsWeight, setGoodsWeight] = useState('');
  const [goodsSent, setGoodsSent] = useState(false);
  const [driverViewing, setDriverViewing] = useState(false);
  const [driverCommunicating, setDriverCommunicating] = useState(false);
  const [driverAcceptedGoods, setDriverAcceptedGoods] = useState(false);
  const [liveTracking, setLiveTracking] = useState(false);
  const [invoiceUploaded, setInvoiceUploaded] = useState(false);

  const fetchLoads = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const db = getFirestore();
      const q = query(collection(db, 'loads'), where('vendorId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const loadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLoads(loadsData);
    } catch (err) {
      setError('Failed to fetch loads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, [currentUser]);

  const handleOpenDialog = (shipment) => {
    setSelectedShipment(shipment);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedShipment(null);
    setVendorName('');
    setLoadInfo('');
    setAmount('');
    setIsReturnLoad(false);
    setReturnLoadName('');
    setReturnLoadInfo('');
    setReturnAmount('');
    setNotificationSent(false);
    setDriverAccepted(false);
    setError('');
  };

  const handleSendLoad = () => {
    if (!vendorName || !loadInfo || !amount) {
      setError('Please fill all fields');
      return;
    }
    // Simulate sending notification to driver
    setNotificationSent(true);
    // Simulate driver acceptance (for demo, assume driver accepts)
    setTimeout(() => {
      setDriverAccepted(true);
    }, 2000);
  };

  const handleCancelLoad = () => {
    setDriverAccepted(false);
    setNotificationSent(false);
    setError('Load cancelled by vendor');
  };

  const handleOpenNewGoodsDialog = () => {
    setNewGoodsDialogOpen(true);
  };

  const handleCloseNewGoodsDialog = () => {
    setNewGoodsDialogOpen(false);
    setGoodsName('');
    setGoodsLocation('');
    setGoodsDate('');
    setGoodsTime('');
    setGoodsAmount('');
    setGoodsWeight('');
    setGoodsSent(false);
    setDriverViewing(false);
    setDriverCommunicating(false);
    setDriverAcceptedGoods(false);
    setLiveTracking(false);
    setInvoiceUploaded(false);
  };

  const handleSendGoods = async () => {
    if (!goodsName || !goodsLocation || !goodsDate || !goodsTime || !goodsAmount || !goodsWeight) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'loads'), {
        goodsName,
        location: goodsLocation,
        date: goodsDate,
        time: goodsTime,
        amount: goodsAmount,
        weight: goodsWeight,
        vendorId: currentUser.uid,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      setGoodsSent(true);
      setTimeout(() => {
        setNewGoodsDialogOpen(false);
        setGoodsName('');
        setGoodsLocation('');
        setGoodsDate('');
        setGoodsTime('');
        setGoodsAmount('');
        setGoodsWeight('');
        setGoodsSent(false);
        setDriverViewing(false);
        setDriverCommunicating(false);
        setDriverAcceptedGoods(false);
        setLiveTracking(false);
        setInvoiceUploaded(false);
        // Refresh loads list
        fetchLoads();
      }, 1200);
    } catch (err) {
      setError('Failed to add goods. Please try again.');
    }
  };

  const handleDriverCommunicate = () => {
    setDriverCommunicating(true);
  };

  const handleDriverAccept = () => {
    setDriverAcceptedGoods(true);
    setLiveTracking(true);
  };

  const handleUploadInvoice = () => {
    setInvoiceUploaded(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ background: '#23272f', color: '#fff', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.18)' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Shipments</Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            loads.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#aaa', my: 2 }}>No loads found. Add new goods to get started.</Typography>
            ) : (
              loads.map((load) => (
                <Box key={load.id} sx={{ mb: 2, p: 2, border: '1px solid #43e97b', borderRadius: 2, background: 'rgba(67,233,123,0.05)' }}>
                  <Typography variant="subtitle1">{load.goodsName || load.name}</Typography>
                  <Typography variant="body2">Location: {load.location}</Typography>
                  <Typography variant="body2">Date: {load.date}</Typography>
                  <Typography variant="body2">Time: {load.time}</Typography>
                  <Typography variant="body2">Amount: {load.amount}</Typography>
                  <Typography variant="body2">Weight: {load.weight}</Typography>
                  <Typography variant="body2">Status: {load.status || 'Pending'}</Typography>
                </Box>
              ))
            )
          )}
          <Button variant="contained" color="primary" onClick={handleOpenNewGoodsDialog} sx={{ mt: 2 }}>
            Add New Goods
          </Button>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Send Load to Driver</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Vendor Name"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Load Information"
            value={loadInfo}
            onChange={(e) => setLoadInfo(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox checked={isReturnLoad} onChange={(e) => setIsReturnLoad(e.target.checked)} />}
            label="Include Return Load"
          />
          {isReturnLoad && (
            <>
              <TextField
                fullWidth
                label="Return Load Name"
                value={returnLoadName}
                onChange={(e) => setReturnLoadName(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Return Load Information"
                value={returnLoadInfo}
                onChange={(e) => setReturnLoadInfo(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Return Amount"
                value={returnAmount}
                onChange={(e) => setReturnAmount(e.target.value)}
                margin="normal"
              />
            </>
          )}
          {notificationSent && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Notification sent to driver. Waiting for acceptance...
            </Alert>
          )}
          {driverAccepted && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Driver accepted the load!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {!driverAccepted && <Button onClick={handleSendLoad} color="primary">Send</Button>}
          {notificationSent && !driverAccepted && <Button onClick={handleCancelLoad} color="error">Cancel Load</Button>}
        </DialogActions>
      </Dialog>
      <Dialog open={newGoodsDialogOpen} onClose={handleCloseNewGoodsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Goods</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Goods Name"
            value={goodsName}
            onChange={(e) => setGoodsName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            value={goodsLocation}
            onChange={(e) => setGoodsLocation(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date"
            value={goodsDate}
            onChange={(e) => setGoodsDate(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Time"
            value={goodsTime}
            onChange={(e) => setGoodsTime(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Amount"
            value={goodsAmount}
            onChange={(e) => setGoodsAmount(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Weight"
            value={goodsWeight}
            onChange={(e) => setGoodsWeight(e.target.value)}
            margin="normal"
          />
          {goodsSent && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Goods information sent to drivers. Waiting for driver to view...
            </Alert>
          )}
          {driverViewing && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Driver is viewing the goods details.
            </Alert>
          )}
          {driverCommunicating && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Driver is communicating with you about the goods.
            </Alert>
          )}
          {driverAcceptedGoods && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Driver accepted the goods! Live tracking is now active.
            </Alert>
          )}
          {liveTracking && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Live tracking is active.
            </Alert>
          )}
          {invoiceUploaded && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Invoice uploaded successfully!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewGoodsDialog}>Cancel</Button>
          {!goodsSent && <Button onClick={handleSendGoods} color="primary">Send</Button>}
          {driverViewing && !driverCommunicating && <Button onClick={handleDriverCommunicate} color="warning">Communicate with Driver</Button>}
          {driverCommunicating && !driverAcceptedGoods && <Button onClick={handleDriverAccept} color="success">Accept Goods</Button>}
          {liveTracking && !invoiceUploaded && <Button onClick={handleUploadInvoice} color="primary">Upload Invoice</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorShipments; 