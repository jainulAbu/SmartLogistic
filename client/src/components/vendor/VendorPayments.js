import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import VendorNavbar from '../layout/VendorNavbar';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import DeliveryList from './DeliveryList';
import PaymentStatus from './PaymentStatus';

const VendorPayments = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
      color: '#fff',
      py: 4
    }}>
      <VendorNavbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Header Section */}
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
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: '#fff',
                  fontWeight: 700,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    textShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
                  }
                }}
              >
                Payments
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
                Manage your payments and transactions
              </Typography>
            </Paper>
          </Grid>

          {/* Payment Stats */}
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
                  <PaymentIcon sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: '#4caf50',
                    transition: 'all 0.3s ease-in-out'
                  }} />
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Total Earnings
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  $0.00
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                  Lifetime earnings
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
                  <AccountBalanceIcon sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: '#4caf50',
                    transition: 'all 0.3s ease-in-out'
                  }} />
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Available Balance
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  $0.00
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                  Ready for withdrawal
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
                  <ReceiptIcon sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: '#4caf50',
                    transition: 'all 0.3s ease-in-out'
                  }} />
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Pending Payments
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  $0.00
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                  Awaiting clearance
                </Typography>
              </CardContent>
            </Card>
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
                    startIcon={<PaymentIcon />}
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
                    Withdraw Funds
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ReceiptIcon />}
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
                    View Invoices
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<HistoryIcon />}
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
                    Transaction History
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AccountBalanceIcon />}
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
                    Bank Details
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

export default VendorPayments; 