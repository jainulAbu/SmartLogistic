import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Support as SupportIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Help as HelpIcon,
  Description as DescriptionIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import VendorNavbar from '../layout/VendorNavbar';
import AppBackground from '../layout/AppBackground';

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

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Here you would typically send the support request to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      setError('Failed to send support request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };

  const supportTopics = [
    {
      icon: <ShippingIcon sx={{ color: '#43e97b' }} />,
      title: 'Delivery Issues',
      description: 'Get help with delivery tracking, delays, or problems',
    },
    {
      icon: <PaymentIcon sx={{ color: '#43e97b' }} />,
      title: 'Payment & Billing',
      description: 'Questions about payments, invoices, or refunds',
    },
    {
      icon: <DescriptionIcon sx={{ color: '#43e97b' }} />,
      title: 'Documentation',
      description: 'Help with shipping documents and customs',
    },
    {
      icon: <HelpIcon sx={{ color: '#43e97b' }} />,
      title: 'General Support',
      description: 'Any other questions or concerns',
    },
  ];

  return (
    <AppBackground>
      <VendorNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 700, mb: 4, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          Support Center
        </Typography>

        <Grid container spacing={3}>
          {/* Support Topics */}
          <Grid item xs={12} md={8}>
            <Paper sx={glassCardStyle}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                How can we help you?
              </Typography>
              <Grid container spacing={2}>
                {supportTopics.map((topic, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      sx={{ 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(67,233,123,0.2)',
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(67,233,123,0.1)',
                        }
                      }}
                      onClick={handleChatOpen}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {topic.icon}
                          <Typography variant="h6" sx={{ color: '#fff', ml: 1 }}>
                            {topic.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {topic.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper sx={glassCardStyle}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon sx={{ color: '#43e97b' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Support" 
                    secondary="support@logistics.com"
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon sx={{ color: '#43e97b' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone Support" 
                    secondary="+1 (555) 123-4567"
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ChatIcon sx={{ color: '#43e97b' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Live Chat" 
                    secondary="Available 24/7"
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                </ListItem>
              </List>
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                onClick={handleChatOpen}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  width: '100%',
                }}
              >
                Start Live Chat
              </Button>
            </Paper>
          </Grid>

          {/* Support Request Form */}
          <Grid item xs={12}>
            <Paper sx={glassCardStyle}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                Submit a Support Request
              </Typography>
              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 2,
                    background: 'rgba(67,233,123,0.1)',
                    color: '#43e97b',
                    border: '1px solid rgba(67,233,123,0.3)',
                  }}
                >
                  Your support request has been submitted successfully. We'll get back to you soon.
                </Alert>
              )}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    background: 'rgba(244,67,54,0.1)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(244,67,54,0.3)',
                  }}
                >
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#43e97b',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#43e97b',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255,255,255,0.7)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      multiline
                      rows={4}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#43e97b',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#43e97b',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255,255,255,0.7)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{
                        background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        '&:hover': {
                          background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                        },
                      }}
                    >
                      {loading ? 'Sending...' : 'Submit Request'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* Live Chat Dialog */}
        <Dialog
          open={chatOpen}
          onClose={handleChatClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(67,233,123,0.15)',
            },
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SupportIcon sx={{ color: '#43e97b', mr: 1 }} />
              <Typography variant="h6">Live Chat Support</Typography>
            </Box>
            <IconButton onClick={handleChatClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ 
              height: 300, 
              overflowY: 'auto',
              mb: 2,
              p: 2,
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 1,
            }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                Connecting to support agent...
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#43e97b',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#43e97b',
                    },
                  },
                }}
              />
              <IconButton
                sx={{
                  background: '#43e97b',
                  color: '#fff',
                  '&:hover': {
                    background: '#38f9d7',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </AppBackground>
  );
};

export default Support; 