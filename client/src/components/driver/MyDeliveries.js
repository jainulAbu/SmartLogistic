import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { LocalShipping, Business, Star, Phone, Email, AccessTime, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import DriverNavbar from '../layout/DriverNavbar';

const glassCardStyle = {
  p: 3,
  borderRadius: 4,
  background: 'rgba(17, 17, 17, 0.95)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(67,233,123,0.15)',
  color: '#fff',
  fontWeight: 700,
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  '&:hover': {
    boxShadow: '0 8px 32px 0 rgba(67,233,123,0.25)',
    borderColor: '#43e97b',
    transform: 'translateY(-2px) scale(1.01)',
  },
};

const statusMap = {
  'accepted': { label: 'Accepted', color: '#ff9800', icon: <AccessTime sx={{ color: '#ff9800' }} /> },
  'in_progress': { label: 'In Progress', color: '#2196f3', icon: <LocalShipping sx={{ color: '#2196f3' }} /> },
  'completed': { label: 'Completed', color: '#43e97b', icon: <CheckCircle sx={{ color: '#43e97b' }} /> },
  'failed': { label: 'Failed', color: '#f44336', icon: <ErrorIcon sx={{ color: '#f44336' }} /> },
};

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const db = getFirestore();
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToDeliveries();
    return () => unsubscribe();
  }, [activeTab]);

  const subscribeToDeliveries = () => {
    let statusFilter;
    if (activeTab === 0) {
      // Active deliveries (accepted and in_progress)
      statusFilter = ['accepted', 'in_progress'];
    } else {
      // Completed deliveries
      statusFilter = ['completed', 'failed'];
    }

    const deliveriesQuery = query(
      collection(db, 'loads'),
      where('driverId', '==', currentUser.uid),
      where('status', 'in', statusFilter)
    );

    return onSnapshot(deliveriesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      }));
      setDeliveries(data);
    });
  };

  const handleStartDelivery = async (delivery) => {
    try {
      await updateDoc(doc(db, 'loads', delivery.id), {
        status: 'in_progress',
        startedAt: new Date(),
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error starting delivery:', error);
    }
  };

  const handleFinishDelivery = async (delivery) => {
    try {
      await updateDoc(doc(db, 'loads', delivery.id), {
        status: 'completed',
        completedAt: new Date(),
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error finishing delivery:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)' }}>
      <DriverNavbar />
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 700, mb: 4, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            My Deliveries
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: '#fff',
                  '&.Mui-selected': {
                    color: '#43e97b',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#43e97b',
                },
              }}
            >
              <Tab label="Active Deliveries" />
              <Tab label="Completed Deliveries" />
            </Tabs>
          </Box>

          <Grid container spacing={3}>
            {deliveries.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ ...glassCardStyle, textAlign: 'center' }}>
                  <Typography sx={{ color: '#fff', opacity: 0.7 }}>
                    No {activeTab === 0 ? 'active' : 'completed'} deliveries found.
                  </Typography>
                </Paper>
              </Grid>
            )}
            {deliveries.map((delivery) => {
              const status = statusMap[delivery.status] || statusMap['accepted'];
              return (
                <Grid item xs={12} md={6} key={delivery.id}>
                  <Paper sx={glassCardStyle}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {status.icon}
                      <Typography variant="h6" sx={{ color: status.color, fontWeight: 700, ml: 1 }}>
                        {status.label}
                      </Typography>
                      <Chip 
                        label={delivery.status.replace('_', ' ').toUpperCase()} 
                        sx={{ 
                          ml: 2, 
                          background: `${status.color}20`,
                          color: status.color,
                          border: `1px solid ${status.color}40`,
                          fontWeight: 700 
                        }} 
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                        <LocalShipping sx={{ color: '#43e97b', fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                        <b>From:</b> {delivery.pickupLocation} <b>To:</b> {delivery.deliveryLocation}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                        <Business sx={{ color: '#43e97b', fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                        <b>Goods Type:</b> {delivery.goodsType}
                      </Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                        <AccessTime sx={{ color: '#43e97b', fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
                        <b>Weight:</b> {delivery.weight} tons
                      </Typography>
                    </Box>

                    {delivery.specialInstructions && (
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label="Special Instructions" 
                          sx={{ 
                            background: 'rgba(67,233,123,0.2)', 
                            color: '#43e97b', 
                            fontWeight: 700, 
                            mb: 1 
                          }} 
                        />
                        <Typography sx={{ color: '#fff', fontStyle: 'italic' }}>
                          {delivery.specialInstructions}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={
                          delivery.status === 'completed' ? 100 : 
                          delivery.status === 'in_progress' ? 60 : 
                          delivery.status === 'accepted' ? 20 : 0
                        } 
                        sx={{ 
                          height: 8, 
                          borderRadius: 2, 
                          background: 'rgba(255,255,255,0.08)', 
                          '& .MuiLinearProgress-bar': { 
                            background: status.color 
                          } 
                        }} 
                      />
                    </Box>

                    {activeTab === 0 && (
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        {delivery.status === 'accepted' && (
                          <Button 
                            variant="contained" 
                            sx={{ 
                              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', 
                              color: '#fff', 
                              fontWeight: 700 
                            }} 
                            onClick={() => handleStartDelivery(delivery)}
                          >
                            Start Delivery
                          </Button>
                        )}
                        {delivery.status === 'in_progress' && (
                          <Button 
                            variant="contained" 
                            sx={{ 
                              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', 
                              color: '#fff', 
                              fontWeight: 700 
                            }} 
                            onClick={() => handleFinishDelivery(delivery)}
                          >
                            Complete Delivery
                          </Button>
                        )}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default MyDeliveries; 