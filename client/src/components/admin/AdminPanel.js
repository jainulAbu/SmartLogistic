import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalShipping as TruckIcon,
  AttachMoney as MoneyIcon,
  Flag as FlagIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import InitializeData from './InitializeData';
import UserManagement from './UserManagement';
import VehicleManagement from './VehicleManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeVehicles: 0,
    totalBookings: 0,
    revenue: 0,
  });
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      switch (activeTab) {
        case 0: // Users
          const usersQuery = query(collection(db, 'users'));
          const usersSnapshot = await getDocs(usersQuery);
          const usersData = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUsers(usersData);
          break;
        case 1: // Vehicles
          const vehiclesQuery = query(collection(db, 'vehicles'));
          const vehiclesSnapshot = await getDocs(vehiclesQuery);
          const vehiclesData = vehiclesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setVehicles(vehiclesData);
          break;
        case 2: // Reports
          const reportsQuery = query(collection(db, 'reports'));
          const reportsSnapshot = await getDocs(reportsQuery);
          const reportsData = reportsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setReports(reportsData);
          break;
      }
      // Fetch overall stats
      const statsQuery = query(collection(db, 'stats'));
      const statsSnapshot = await getDocs(statsQuery);
      const statsData = statsSnapshot.docs[0]?.data() || {};
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const userRef = doc(db, 'users', userId);
      switch (action) {
        case 'verify':
          await updateDoc(userRef, { verified: true });
          break;
        case 'block':
          await updateDoc(userRef, { blocked: true });
          break;
        case 'unblock':
          await updateDoc(userRef, { blocked: false });
          break;
      }
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleVehicleAction = async (vehicleId, action) => {
    try {
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      switch (action) {
        case 'approve':
          await updateDoc(vehicleRef, { approved: true });
          break;
        case 'reject':
          await updateDoc(vehicleRef, { approved: false });
          break;
      }
      fetchData();
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: action === 'resolve' ? 'resolved' : 'dismissed',
        resolvedAt: serverTimestamp(),
        resolvedBy: auth.currentUser.uid,
      });
      fetchData();
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="User Management" />
                <Tab label="Vehicle Management" />
                <Tab label="Initialize Data" />
              </Tabs>
            </Box>
            {activeTab === 0 && <UserManagement />}
            {activeTab === 1 && <VehicleManagement />}
            {activeTab === 2 && <InitializeData />}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel;