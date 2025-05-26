import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  ListAlt as ListAltIcon,
  MonetizationOn as MonetizationOnIcon,
  Map as MapIcon,
  CloudUpload as CloudUploadIcon,
  Feedback as FeedbackIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  LocationOn as LocationIcon,
  Chat as ChatIcon,
  DirectionsCar as CarIcon,
  Settings,
} from '@mui/icons-material';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppBackground from '../layout/AppBackground';
import { Line } from 'react-chartjs-2';
import ChatComponent from '../chat/ChatComponent';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import VendorNavbar from '../layout/VendorNavbar';
import DriverNavbar from '../layout/DriverNavbar';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, value: 0 },
  { label: 'My Deliveries', icon: <TruckIcon />, value: 1 },
  { label: 'Profile', icon: <AccountCircleIcon />, value: 2 },
];

const glassCardStyle = {
  p: 4,
  borderRadius: 5,
  background: 'rgba(17, 17, 17, 0.95)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(67,233,123,0.15)',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  color: '#fff',
  fontWeight: 700,
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  '&:hover': {
    boxShadow: '0 8px 32px 0 rgba(67,233,123,0.25)',
    borderColor: '#43e97b',
    transform: 'translateY(-2px) scale(1.01)',
  },
};

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    totalEarnings: 0,
    rating: 0,
    completedTrips: 0,
  });
  const { currentUser } = useAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', vehicle: '', rating: 4.5 });
  const [profileEdit, setProfileEdit] = useState({ name: '', phone: '' });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoad, setChatLoad] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchDriverStatus();
    fetchDeliveries();
    fetchProfile();
  }, [activeTab]);

  const fetchDriverStatus = async () => {
    try {
      const driverRef = doc(db, 'drivers', currentUser.uid);
      const driverDoc = await getDoc(driverRef);
      if (driverDoc.exists()) {
        setIsOnline(driverDoc.data().isOnline || false);
      }
    } catch (error) {
      console.error('Error fetching driver status:', error);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.checked;
    try {
      const driverRef = doc(db, 'drivers', currentUser.uid);
      await updateDoc(driverRef, {
        isOnline: newStatus,
        lastStatusUpdate: new Date().toISOString()
      });
      setIsOnline(newStatus);
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch active deliveries
      const activeDeliveriesQuery = query(
        collection(db, 'loads'),
        where('driverId', '==', currentUser.uid),
        where('status', 'in', ['pending', 'in-progress'])
      );
      const activeDeliveriesSnapshot = await getDocs(activeDeliveriesQuery);
      const activeDeliveries = activeDeliveriesSnapshot.size;

      // Fetch completed trips and earnings
      const completedDeliveriesQuery = query(
        collection(db, 'loads'),
        where('driverId', '==', currentUser.uid),
        where('status', '==', 'completed')
      );
      const completedDeliveriesSnapshot = await getDocs(completedDeliveriesQuery);
      const completedDeliveries = completedDeliveriesSnapshot.size;
      
      let totalEarnings = 0;
      completedDeliveriesSnapshot.forEach(doc => {
        totalEarnings += Number(doc.data().driverBid) || 0;
      });

      setStats({
        activeDeliveries,
        totalEarnings,
        rating: 4.5, // This should come from driver's profile
        completedTrips: completedDeliveries,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchDeliveries = async () => {
    // Placeholder: Replace with real Firestore fetch
    setDeliveries([
      { id: 'L001', pickup: 'Chennai', delivery: 'Bangalore', status: 'In Progress', date: '2024-06-01', price: 1200 },
      { id: 'L002', pickup: 'Hyderabad', delivery: 'Pune', status: 'Completed', date: '2024-05-28', price: 1500 },
    ]);
  };

  const fetchProfile = async () => {
    try {
      const driverRef = doc(db, 'drivers', currentUser.uid);
      const driverDoc = await getDoc(driverRef);
      if (driverDoc.exists()) {
        const data = driverDoc.data();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          vehicle: data.vehicleType || '',
          rating: data.rating || 4.5
        });
        setProfileEdit({ name: data.name || '', phone: data.phone || '' });
      }
    } catch (error) {
      console.error('Error fetching driver profile:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNavClick = (value) => {
    if (value === 2) {
      navigate('/driver-dashboard/profile');
    } else {
      setActiveTab(value);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/driver/login');
  };

  const handleProfileEditOpen = () => setShowProfileEdit(true);
  const handleProfileEditClose = () => setShowProfileEdit(false);
  const handleProfileEditSave = async () => {
    try {
      const driverRef = doc(db, 'drivers', currentUser.uid);
      await updateDoc(driverRef, {
        name: profileEdit.name,
        phone: profileEdit.phone
      });
      setProfile({ ...profile, name: profileEdit.name, phone: profileEdit.phone });
      setShowProfileEdit(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <AppBackground>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
        color: '#fff',
        py: 4,
        transition: 'all 0.3s ease-in-out'
      }}>
        <Container maxWidth="xl">
        {/* Main Content based on activeTab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Welcome and Motivation */}
            <Grid item xs={12} md={6}>
              <Box sx={{ ...glassCardStyle, mb: 3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#43e97b', mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Welcome, {profile.name || 'Driver'}!
                </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2, opacity: 0.85 }}>
                  "The road to success is always under construction. Keep moving forward!"
                </Typography>
                <Box sx={{ width: '100%', mt: 2 }}>
                      <Typography sx={{ color: '#fff', mb: 1, opacity: 0.7 }}>Completed Trips Progress</Typography>
                  <Box sx={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 2, p: 1 }}>
                    <Box sx={{ width: `${Math.min(100, (stats.completedTrips / 50) * 100)}%`, height: 16, background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', borderRadius: 2 }} />
                  </Box>
                  <Typography sx={{ color: '#43e97b', mt: 1 }}>{stats.completedTrips} / 50 trips</Typography>
                </Box>
              </Box>
            </Grid>
            {/* Upcoming Delivery Widget */}
            <Grid item xs={12} md={6}>
              <Box sx={{ ...glassCardStyle, minHeight: 180 }}>
                <Typography variant="h6" sx={{ color: '#43e97b', mb: 1 }}>Upcoming Delivery</Typography>
                <Typography sx={{ color: '#fff' }}><b>Load ID:</b> L003</Typography>
                <Typography sx={{ color: '#fff' }}><b>Pickup:</b> Mumbai, 2024-06-10 09:00 AM</Typography>
                <Typography sx={{ color: '#fff' }}><b>Delivery:</b> Delhi</Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}><b>Status:</b> Scheduled</Typography>
                <Typography sx={{ color: '#43e97b', fontWeight: 700 }}>Countdown: 2 days 5 hours</Typography>
              </Box>
            </Grid>
            {/* Recent Activity Feed */}
            <Grid item xs={12} md={4}>
              <Box sx={{ ...glassCardStyle, minHeight: 180 }}>
                <Typography variant="h6" sx={{ color: '#43e97b', mb: 1 }}>Recent Activity</Typography>
                    <ul style={{ color: '#fff', paddingLeft: 18, opacity: 0.85 }}>
                  <li>Accepted load L003 (Mumbai → Delhi)</li>
                  <li>Completed delivery L002 (Hyderabad → Pune)</li>
                  <li>Message received from Vendor A</li>
                </ul>
              </Box>
            </Grid>
            {/* Profile Completion Progress */}
            <Grid item xs={12} md={4}>
              <Box sx={{ ...glassCardStyle, minHeight: 180, alignItems: 'center', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#43e97b', mb: 1 }}>Profile Completion</Typography>
                <Box sx={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 2, p: 1, mb: 1 }}>
                  <Box sx={{ width: '80%', height: 16, background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', borderRadius: 2 }} />
                </Box>
                <Typography sx={{ color: '#43e97b', fontWeight: 700 }}>80% Complete</Typography>
              </Box>
            </Grid>
            {/* Map Integration (static preview) */}
            <Grid item xs={12} md={4}>
              <Box sx={{ ...glassCardStyle, minHeight: 180, alignItems: 'center', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#43e97b', mb: 1 }}><MapIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Route Preview</Typography>
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=Mumbai,IN&zoom=5&size=300x100&maptype=roadmap&markers=color:green%7Clabel:P%7CMumbai,IN&markers=color:red%7Clabel:D%7CDelhi,IN&key=YOUR_API_KEY" alt="Route Map" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
                <Typography sx={{ color: '#fff' }}>Mumbai → Delhi</Typography>
              </Box>
            </Grid>
            {/* Driver Leaderboard */}
            <Grid item xs={12} md={6}>
              <Box sx={{ ...glassCardStyle, minHeight: 180 }}>
                <Typography variant="h6" sx={{ color: '#43e97b', mb: 1 }}>Driver Leaderboard</Typography>
                    <ol style={{ color: '#fff', paddingLeft: 18, opacity: 0.85 }}>
                  <li>Driver #1 (32 deliveries)</li>
                  <li>Driver #2 (28 deliveries)</li>
                  <li>You (22 deliveries)</li>
                </ol>
              </Box>
            </Grid>
            {/* Document Uploads */}
            <Grid item xs={12} md={6}>
              <Box sx={{ ...glassCardStyle, minHeight: 180 }}>
                <Typography variant="h6" sx={{ color: '#43e97b', mb: 1 }}><CloudUploadIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Document Uploads</Typography>
                <Button variant="contained" startIcon={<CloudUploadIcon />} sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', mb: 1 }}>Upload License</Button>
                <Button variant="contained" startIcon={<CloudUploadIcon />} sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', mb: 1, ml: 2 }}>Upload Insurance</Button>
                <Typography sx={{ color: '#fff', mt: 1 }}>License: <span style={{ color: '#43e97b' }}>Verified</span></Typography>
                <Typography sx={{ color: '#fff' }}>Insurance: <span style={{ color: '#ff9800' }}>Pending</span></Typography>
              </Box>
            </Grid>
            {/* Feedback & Ratings */}
            <Grid item xs={12} md={6}>
              <Box sx={{ ...glassCardStyle, minHeight: 180 }}>
                <Typography variant="h6" sx={{ color: '#43e97b', mb: 1 }}><FeedbackIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Recent Feedback</Typography>
                <Box sx={{ color: '#fff', mb: 1 }}>
                  <Typography>Vendor A: <StarIcon sx={{ color: '#43e97b', fontSize: 18, mb: '-2px' }} /> 5 - "Great delivery!"</Typography>
                  <Typography>Vendor B: <StarIcon sx={{ color: '#43e97b', fontSize: 18, mb: '-2px' }} /> 4 - "On time, good communication."</Typography>
                </Box>
                <Typography sx={{ color: '#fff', mt: 1 }}>Rate Your Last Delivery:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  {[1,2,3,4,5].map(star => (
                    <StarIcon key={star} sx={{ color: '#43e97b', cursor: 'pointer' }} />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
        {activeTab === 1 && (
          <Box sx={glassCardStyle}>
            <Typography variant="h5" sx={{ mb: 2 }}>My Deliveries</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Load ID</TableCell>
                  <TableCell>Pickup</TableCell>
                  <TableCell>Delivery</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveries.map((d) => (
                  <TableRow key={d.id} sx={{ background: d.status === 'Completed' ? 'rgba(67,233,123,0.10)' : 'inherit' }}>
                    <TableCell>{d.id}</TableCell>
                    <TableCell>{d.pickup}</TableCell>
                    <TableCell>{d.delivery}</TableCell>
                    <TableCell>
                      <span style={{ color: d.status === 'Completed' ? '#43e97b' : '#fff', fontWeight: 700 }}>{d.status}</span>
                    </TableCell>
                    <TableCell>{d.date}</TableCell>
                    <TableCell>₹{d.price}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => { setChatLoad(d); setChatOpen(true); }}>Chat with Vendor</Button>
                      <Button variant="contained" sx={{ ml: 1, background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: '#fff' }}>Track</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {chatLoad && (
              <Dialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chat with Vendor</DialogTitle>
                <DialogContent>
                  <ChatComponent
                    loadId={chatLoad.id}
                    vendorId={chatLoad.vendorId}
                    driverId={currentUser.uid}
                    open={chatOpen}
                    onClose={() => setChatOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
            </Box>
          )}
            {activeTab === 2 && (
              <Box sx={glassCardStyle}>
                <Typography variant="h5" sx={{ mb: 2 }}>Profile</Typography>
                {/* Profile form */}
                {/* Add your profile form components here */}
          </Box>
        )}
      </Container>
      </Box>
    </AppBackground>
  );
};

export default DriverDashboard; 