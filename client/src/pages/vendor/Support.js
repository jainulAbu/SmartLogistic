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
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import AppBackground from '../../components/layout/AppBackground';

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

const Support = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
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
      await addDoc(collection(db, 'support-tickets'), {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'open',
        createdAt: serverTimestamp(),
      });
      setSuccess('Your message has been sent successfully! We will get back to you soon.');
      setFormData({ subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)', py: 4 }}>
        <Container maxWidth="lg">
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
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={contactItemStyle}>
                    <EmailIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.7 }}>Email</Typography>
                      <Typography>support@logisticsapp.com</Typography>
                    </Box>
                  </Box>
                  <Box sx={contactItemStyle}>
                    <PhoneIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.7 }}>Phone</Typography>
                      <Typography>+1 (555) 123-4567</Typography>
                    </Box>
                  </Box>
                  <Box sx={contactItemStyle}>
                    <LocationOnIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.7 }}>Address</Typography>
                      <Typography>123 Logistics Street, Business District, City, Country</Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ my: 4, borderColor: 'rgba(67,233,123,0.2)' }} />
                <Typography variant="h6" sx={{ color: '#43e97b', mb: 2 }}>
                  Business Hours
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ color: '#fff' }}>Monday - Friday: 9:00 AM - 6:00 PM</Typography>
                  <Typography sx={{ color: '#fff' }}>Saturday: 10:00 AM - 4:00 PM</Typography>
                  <Typography sx={{ color: '#fff' }}>Sunday: Closed</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AppBackground>
  );
};

export default Support; 