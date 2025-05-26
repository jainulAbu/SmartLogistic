import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  LocationOn as LocationIcon,
  Chat as ChatIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, collection, query, where, onSnapshot, orderBy, limit, doc, deleteDoc } from 'firebase/firestore';
import AppBackground from '../layout/AppBackground';
import AdminNavbar from '../layout/AdminNavbar';
import { useNavigate } from 'react-router-dom';

const glassCardStyle = {
  p: 3,
  borderRadius: 4,
  background: 'rgba(17, 17, 17, 0.95)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(67,233,123,0.15)',
  color: '#fff',
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  '&:hover': {
    boxShadow: '0 8px 32px 0 rgba(67,233,123,0.25)',
    borderColor: '#43e97b',
    transform: 'translateY(-2px) scale(1.01)',
  },
};

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const db = getFirestore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch shipments
    const shipmentsQuery = query(collection(db, 'shipments'));
    const unsubscribeShipments = onSnapshot(shipmentsQuery, (snapshot) => {
      const shipmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShipments(shipmentsData);
    });

    return () => {
      unsubscribeShipments();
    };
  }, [db]);

  useEffect(() => {
    const q = query(collection(db, 'adminNotifications'), orderBy('deletedAt', 'desc'), limit(10));
    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [db]);

  // Calculate accurate statistics
  const activeDeliveries = shipments.filter(s => s.status === 'in_progress' || s.status === 'pending').length;
  const completedDeliveries = shipments.filter(s => s.status === 'completed').length;
  const rejectedDeliveries = shipments.filter(s => s.status === 'rejected' || s.status === 'cancelled').length;

  const handleDeleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, 'adminNotifications', id));
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <AppBackground>
      <AdminNavbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
          {/* Header Section */}
            <Grid item xs={12}>
            <Paper sx={glassCardStyle}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#9C92AC' }}>
                Admin Dashboard
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#6B7280' }}>
                Welcome back, {currentUser?.displayName || 'Admin'}
              </Typography>
                      </Paper>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={glassCardStyle}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PendingIcon sx={{ fontSize: 40, mr: 2, color: '#9C92AC' }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#4A4A4A' }}>Active Deliveries</Typography>
                    <Typography variant="h4" sx={{ color: '#9C92AC' }}>{activeDeliveries}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Deliveries in progress or pending
                </Typography>
              </CardContent>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={glassCardStyle}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CompletedIcon sx={{ fontSize: 40, mr: 2, color: '#9C92AC' }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#4A4A4A' }}>Completed</Typography>
                    <Typography variant="h4" sx={{ color: '#9C92AC' }}>{completedDeliveries}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Successfully completed deliveries
                </Typography>
              </CardContent>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={glassCardStyle}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ErrorIcon sx={{ fontSize: 40, mr: 2, color: '#E6A4A4' }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#4A4A4A' }}>Rejected</Typography>
                    <Typography variant="h4" sx={{ color: '#E6A4A4' }}>{rejectedDeliveries}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Rejected or cancelled deliveries
                </Typography>
              </CardContent>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={glassCardStyle}>
              <Typography variant="h6" gutterBottom sx={{ color: '#9C92AC' }}>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(156, 146, 172, 0.2)' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<TruckIcon />}
                    onClick={() => navigate('/admin/active-deliveries')}
                    sx={{
                      background: '#9C92AC',
                      '&:hover': {
                        background: '#8A7F9C',
                      },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Active Deliveries
                  </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PendingIcon />}
                    onClick={() => navigate('/admin/pending-deliveries')}
                    sx={{
                      background: '#9C92AC',
                      '&:hover': {
                        background: '#8A7F9C',
                      },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Pending Deliveries
                  </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<CompletedIcon />}
                    onClick={() => navigate('/admin/completed-deliveries')}
                    sx={{
                      background: '#9C92AC',
                      '&:hover': {
                        background: '#8A7F9C',
                      },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Completed Deliveries
                  </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ErrorIcon />}
                    onClick={() => navigate('/admin/support')}
                    sx={{
                      background: '#9C92AC',
                      '&:hover': {
                        background: '#8A7F9C',
                      },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Support
                  </Button>
                    </Grid>
                  </Grid>
            </Paper>
            </Grid>

          {/* Recent Deliveries Section */}
          <Grid item xs={12}>
            <Paper sx={glassCardStyle}>
              <Typography variant="h6" gutterBottom sx={{ color: '#9C92AC' }}>
                Recent Deliveries
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(156, 146, 172, 0.2)' }} />
              <List>
                {shipments.slice(0, 5).map((shipment) => (
                  <ListItem
                    key={shipment.id}
                    divider
                    sx={{
                      background: 'rgba(156, 146, 172, 0.05)',
                      borderRadius: 1,
                      mb: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: 'rgba(156, 146, 172, 0.1)',
                        transform: 'translateX(5px)',
                      },
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton onClick={() => navigate(`/admin/delivery-details/${shipment.id}`)}>
                          <LocationIcon sx={{ color: '#9C92AC' }} />
                        </IconButton>
                        <IconButton onClick={() => navigate(`/admin/chat/${shipment.id}`)}>
                          <ChatIcon sx={{ color: '#9C92AC' }} />
                        </IconButton>
                      </Box>
                    }
                  >
                        <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ color: '#4A4A4A' }}>
                          {shipment.pickupLocation} → {shipment.deliveryLocation}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Status: {shipment.status}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Driver: {shipment.driverName || 'Not assigned'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Last Updated: {shipment.trackingHistory?.[shipment.trackingHistory.length - 1]?.timestamp?.toDate().toLocaleString() || 'N/A'}
                          </Typography>
                        </>
                      }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
            </Grid>

          {/* Support Section */}
          <Grid item xs={12}>
            <Paper sx={glassCardStyle}>
              <Typography variant="h6" gutterBottom sx={{ color: '#9C92AC' }}>
                Support & Help
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(156, 146, 172, 0.2)' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ChatIcon />}
                    onClick={() => navigate('/admin/live-chat')}
                    sx={{
                      color: '#9C92AC',
                      borderColor: '#9C92AC',
                      '&:hover': {
                        borderColor: '#8A7F9C',
                        background: 'rgba(156, 146, 172, 0.08)',
                      },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Live Chat Support
                </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ErrorIcon />}
                    onClick={() => navigate('/admin/report-issue')}
                    sx={{
                      color: '#9C92AC',
                      borderColor: '#9C92AC',
                      '&:hover': {
                        borderColor: '#8A7F9C',
                        background: 'rgba(156, 146, 172, 0.08)',
                      },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Report an Issue
                </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CompletedIcon />}
                    onClick={() => navigate('/admin/faq')}
                    sx={{
                      color: '#9C92AC',
                      borderColor: '#9C92AC',
                      '&:hover': {
                        borderColor: '#8A7F9C',
                        background: 'rgba(156, 146, 172, 0.08)',
                      },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    FAQ & Help Center
                  </Button>
            </Grid>
            </Grid>
            </Paper>
          </Grid>

          {/* Admin Notifications Section */}
          <Paper sx={glassCardStyle}>
            <Typography variant="h6" sx={{ color: '#9C92AC', mb: 2 }}>
              Recent Vendor Deleted Goods
            </Typography>
            {notifications.length === 0 ? (
              <Typography>No recent deletions.</Typography>
            ) : (
              notifications.map(n => (
                <Paper key={n.id} sx={{ p: 2, mb: 2, background: '#fff', borderRadius: 1, boxShadow: '0 1px 4px rgba(156,146,172,0.08)' }}>
                  <Typography variant="subtitle1" sx={{ color: '#9C92AC' }}>{n.goodsName}</Typography>
                  <Typography variant="body2">Vendor: {n.vendorId}</Typography>
                  <Typography variant="body2">Time: {n.deletedAt?.toDate ? n.deletedAt.toDate().toLocaleString() : ''}</Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>{n.message}</Typography>
                  <IconButton onClick={() => handleDeleteNotification(n.id)} sx={{ color: '#dc004e', ml: 1 }}><DeleteIcon /></IconButton>
                </Paper>
              ))
            )}
          </Paper>
          </Grid>
        </Container>
    </AppBackground>
  );
};

export default AdminDashboard; 