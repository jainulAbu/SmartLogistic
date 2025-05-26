import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import AppBackground from '../layout/AppBackground';
import DriverNavbar from '../layout/DriverNavbar';

const glassCardStyle = {
  p: 4,
  width: '100%',
  borderRadius: 5,
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

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  p: 2,
  borderRadius: 2,
  bgcolor: 'rgba(67,233,123,0.08)',
  border: '1px solid rgba(67,233,123,0.2)',
  color: '#43e97b',
  transition: 'all 0.3s ease',
  '&:hover': {
    bgcolor: 'rgba(67,233,123,0.12)',
    transform: 'translateY(-2px)',
  },
};

const faqItemStyle = {
  bgcolor: 'rgba(0,0,0,0.18)',
  borderRadius: 2,
  mb: 2,
  overflow: 'hidden',
  border: '1px solid rgba(67,233,123,0.15)',
};

const DriverSupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const { currentUser } = useAuth();
  const db = getFirestore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await addDoc(collection(db, 'driver-support-tickets'), {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'open',
        createdAt: serverTimestamp(),
      });
      setSuccess('Your message has been sent successfully! We will get back to you soon.');
      setFormData({ subject: '', message: '', category: 'general' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFaqClick = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I update my vehicle information?',
      answer: 'You can update your vehicle information in your profile settings. Go to the Profile page and click on the Edit button to modify your vehicle details.',
      icon: <DirectionsCarIcon sx={{ color: '#43e97b' }} />,
    },
    {
      question: 'How are deliveries assigned to me?',
      answer: 'Deliveries are assigned based on your location, vehicle type, and availability. The system automatically matches you with the most suitable deliveries in your area.',
      icon: <AssignmentIcon sx={{ color: '#43e97b' }} />,
    },
    {
      question: 'When and how do I receive payments?',
      answer: 'Payments are processed weekly for all completed deliveries. You can view your earnings and payment history in the Earnings section of your dashboard.',
      icon: <PaymentIcon sx={{ color: '#43e97b' }} />,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)' }}>
      <DriverNavbar />
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 700, mb: 4, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Support Center
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={glassCardStyle}>
                <Typography variant="h4" sx={{ color: '#43e97b', mb: 3, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Contact Support
                </Typography>
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                    InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff' } }}
                    InputLabelProps={{ style: { color: '#fff' } }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    sx={{ mb: 3 }}
                    InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff' } }}
                    InputLabelProps={{ style: { color: '#fff' } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : <SendIcon />}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                      color: '#fff',
                      boxShadow: '0 2px 12px 0 #43e97b44',
                      textTransform: 'none',
                      letterSpacing: 1,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={glassCardStyle}>
                <Typography variant="h4" sx={{ color: '#43e97b', mb: 3, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Frequently Asked Questions
                </Typography>
                <List>
                  {faqs.map((faq, index) => (
                    <ListItem
                      key={index}
                      sx={faqItemStyle}
                      button
                      onClick={() => handleFaqClick(index)}
                    >
                      <ListItemIcon>{faq.icon}</ListItemIcon>
                      <ListItemText
                        primary={faq.question}
                        primaryTypographyProps={{
                          sx: { color: '#fff', fontWeight: 600 },
                        }}
                      />
                      {expandedFaq === index ? <ExpandLessIcon sx={{ color: '#43e97b' }} /> : <ExpandMoreIcon sx={{ color: '#43e97b' }} />}
                    </ListItem>
                  ))}
                  {faqs.map((faq, index) => (
                    <Collapse key={`answer-${index}`} in={expandedFaq === index} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, bgcolor: 'rgba(67,233,123,0.08)', borderRadius: 2, ml: 4, mr: 2, mb: 2 }}>
                        <Typography sx={{ color: '#fff' }}>{faq.answer}</Typography>
                      </Box>
                    </Collapse>
                  ))}
                </List>

                <Divider sx={{ my: 4, borderColor: 'rgba(67,233,123,0.2)' }} />

                <Typography variant="h4" sx={{ color: '#43e97b', mb: 3, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={contactItemStyle}>
                    <EmailIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.7 }}>Driver Support Email</Typography>
                      <Typography>driver-support@logisticsapp.com</Typography>
                    </Box>
                  </Box>
                  <Box sx={contactItemStyle}>
                    <PhoneIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.7 }}>Driver Support Hotline</Typography>
                      <Typography>+1 (555) 987-6543</Typography>
                    </Box>
                  </Box>
                  <Box sx={contactItemStyle}>
                    <LocationOnIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.7 }}>Driver Support Center</Typography>
                      <Typography>456 Driver Support Ave, Logistics District, City, Country</Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DriverSupport; 