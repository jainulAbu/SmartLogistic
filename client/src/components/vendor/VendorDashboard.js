import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
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
} from '@mui/icons-material';
import DeliveryList from './DeliveryList';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import AppBackground from '../layout/AppBackground';
import VendorNavbar from '../layout/VendorNavbar';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [shipments, setShipments] = useState([]);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch shipments
    const shipmentsQuery = query(
      collection(db, 'shipments'),
      where('vendorId', '==', currentUser.uid)
    );
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
  }, [currentUser.uid, db]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Calculate accurate statistics
  const activeDeliveries = shipments.filter(s => s.status === 'in_progress' || s.status === 'pending').length;
  const completedDeliveries = shipments.filter(s => s.status === 'completed').length;
  const rejectedDeliveries = shipments.filter(s => s.status === 'rejected' || s.status === 'cancelled').length;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
      color: '#fff',
      py: 4,
      transition: 'all 0.3s ease-in-out'
    }}>
      <VendorNavbar />
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }
            }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  color: '#fff',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    textShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
                  }
                }}
              >
                Vendor Dashboard
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    color: '#fff',
                    transform: 'translateX(10px)'
                  }
                }}
              >
                Welcome back, {currentUser?.displayName || 'Vendor'}
              </Typography>
            </Paper>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.2) rotate(5deg)',
                  color: '#4caf50'
                }
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PendingIcon sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: '#4caf50',
                    transition: 'all 0.3s ease-in-out'
                  }} />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#fff',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          color: '#4caf50'
                        }
                      }}
                    >
                      Active Deliveries
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#4caf50',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          textShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
                        }
                      }}
                    >
                      {activeDeliveries}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      color: '#fff',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  Deliveries in progress or pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.2) rotate(5deg)',
                  color: '#4caf50'
                }
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CompletedIcon sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: '#4caf50',
                    transition: 'all 0.3s ease-in-out'
                  }} />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#fff',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          color: '#4caf50'
                        }
                      }}
                    >
                      Completed
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#4caf50',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          textShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
                        }
                      }}
                    >
                      {completedDeliveries}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      color: '#fff',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  Successfully completed deliveries
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.2) rotate(5deg)',
                  color: '#4caf50'
                }
              }
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ErrorIcon sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: '#ff6b6b',
                    transition: 'all 0.3s ease-in-out'
                  }} />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#fff',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          color: '#4caf50'
                        }
                      }}
                    >
                      Rejected
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#ff6b6b',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          textShadow: '0 0 10px rgba(255, 107, 107, 0.5)'
                        }
                      }}
                    >
                      {rejectedDeliveries}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      color: '#fff',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  Rejected or cancelled deliveries
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Deliveries Section */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3, 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }
            }}>
              <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant={isMobile ? "fullWidth" : "standard"}
                  centered={!isMobile}
                  sx={{
                    '& .MuiTab-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-selected': {
                        color: '#4caf50',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#4caf50',
                    },
                  }}
                >
                  <Tab
                    icon={<TruckIcon />}
                    label="Active Deliveries"
                    iconPosition="start"
                  />
                  <Tab
                    icon={<CompletedIcon />}
                    label="Completed Deliveries"
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {activeTab === 0 ? (
                <DeliveryList type="active" />
              ) : (
                <DeliveryList type="completed" />
              )}
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3, 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }
            }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#fff',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    color: '#4caf50'
                  }
                }}
              >
                Quick Actions
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: '#4caf50'
                }
              }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<TruckIcon />}
                    onClick={() => navigate('/vendor-dashboard/active-deliveries')}
                    sx={{
                      background: '#4caf50',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: '#45a049',
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                        '& .MuiSvgIcon-root': {
                          transform: 'rotate(15deg)'
                        }
                      },
                      '& .MuiSvgIcon-root': {
                        transition: 'all 0.3s ease-in-out'
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
                    onClick={() => navigate('/vendor-dashboard/pending-deliveries')}
                    sx={{
                      background: '#4caf50',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: '#45a049',
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                        '& .MuiSvgIcon-root': {
                          transform: 'rotate(15deg)'
                        }
                      },
                      '& .MuiSvgIcon-root': {
                        transition: 'all 0.3s ease-in-out'
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
                    onClick={() => navigate('/vendor-dashboard/completed-deliveries')}
                    sx={{
                      background: '#4caf50',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: '#45a049',
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                        '& .MuiSvgIcon-root': {
                          transform: 'rotate(15deg)'
                        }
                      },
                      '& .MuiSvgIcon-root': {
                        transition: 'all 0.3s ease-in-out'
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
                    onClick={() => navigate('/vendor-dashboard/support')}
                    sx={{
                      background: '#4caf50',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: '#45a049',
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                        '& .MuiSvgIcon-root': {
                          transform: 'rotate(15deg)'
                        }
                      },
                      '& .MuiSvgIcon-root': {
                        transition: 'all 0.3s ease-in-out'
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
            <Paper sx={{ 
              p: 3, 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }
            }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#fff',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    color: '#4caf50'
                  }
                }}
              >
                Recent Deliveries
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: '#4caf50'
                }
              }} />
              <List>
                {shipments.slice(0, 5).map((shipment) => (
                  <ListItem
                    key={shipment.id}
                    divider
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
                      mb: 1,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateX(10px) scale(1.02)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        '& .MuiSvgIcon-root': {
                          transform: 'scale(1.2)',
                          color: '#4caf50'
                        }
                      },
                      '& .MuiSvgIcon-root': {
                        transition: 'all 0.3s ease-in-out'
                      }
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton onClick={() => navigate(`/vendor-dashboard/delivery-details/${shipment.id}`)}>
                          <LocationIcon sx={{ color: '#fff' }} />
                        </IconButton>
                        <IconButton onClick={() => navigate(`/vendor-dashboard/chat/${shipment.id}`)}>
                          <ChatIcon sx={{ color: '#fff' }} />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                          {shipment.pickupLocation} → {shipment.deliveryLocation}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Status: {shipment.status}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Driver: {shipment.driverName || 'Not assigned'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
            <Paper sx={{ 
              p: 3, 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                Support & Help
              </Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ChatIcon />}
                    onClick={() => navigate('/vendor-dashboard/live-chat')}
                    sx={{
                      color: '#fff',
                      borderColor: '#4caf50',
                      '&:hover': {
                        borderColor: '#45a049',
                        background: 'rgba(255, 255, 255, 0.08)',
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
                    onClick={() => navigate('/vendor-dashboard/report-issue')}
                    sx={{
                      color: '#fff',
                      borderColor: '#4caf50',
                      '&:hover': {
                        borderColor: '#45a049',
                        background: 'rgba(255, 255, 255, 0.08)',
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
                    onClick={() => navigate('/vendor-dashboard/faq')}
                    sx={{
                      color: '#fff',
                      borderColor: '#4caf50',
                      '&:hover': {
                        borderColor: '#45a049',
                        background: 'rgba(255, 255, 255, 0.08)',
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
        </Grid>
      </Container>
    </Box>
  );
};

export default VendorDashboard; 