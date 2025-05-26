import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  AccessTime as AccessTimeIcon,
  WhatsApp as WhatsAppIcon,
  Chat as ChatIcon,
  Business as BusinessIcon,
  Language as LanguageIcon,
  Support as SupportIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('contact');
  const [mapError, setMapError] = useState(false);

  // Map configuration
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
  };

  const center = {
    lat: 40.7128,
    lng: -74.0060,
  };

  const locations = [
    {
      id: 1,
      name: 'New York Office',
      position: { lat: 40.7128, lng: -74.0060 },
      address: '123 Logistics Street, NY 10001',
      phone: '+1 (555) 123-4567',
    },
    {
      id: 2,
      name: 'Los Angeles Office',
      position: { lat: 34.0522, lng: -118.2437 },
      address: '456 Transport Ave, LA 90001',
      phone: '+1 (555) 987-6543',
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSnackbar({
      open: true,
      message: 'Message sent successfully!',
      severity: 'success',
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMapError = () => {
    setMapError(true);
    setSnackbar({
      open: true,
      message: 'Failed to load Google Maps. Please try again later.',
      severity: 'error',
    });
  };

  const contactInfo = [
    {
      icon: <LocationIcon />,
      title: 'Our Location',
      content: '123 Logistics Street, Business District, City, State 12345',
      color: '#43e97b',
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone Number',
      content: '+1 (555) 123-4567',
      color: '#ff5e62',
    },
    {
      icon: <EmailIcon />,
      title: 'Email Address',
      content: 'support@logisticsapp.com',
      color: '#2196f3',
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Working Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
      color: '#ffb300',
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#', color: '#1877f2', label: 'Facebook' },
    { icon: <TwitterIcon />, url: '#', color: '#1da1f2', label: 'Twitter' },
    { icon: <LinkedInIcon />, url: '#', color: '#0077b5', label: 'LinkedIn' },
    { icon: <InstagramIcon />, url: '#', color: '#e4405f', label: 'Instagram' },
  ];

  const quickLinks = [
    { icon: <WhatsAppIcon />, label: 'WhatsApp Support', color: '#25D366' },
    { icon: <ChatIcon />, label: 'Live Chat', color: '#2196f3' },
    { icon: <SupportIcon />, label: 'Help Center', color: '#ff9800' },
    { icon: <VerifiedIcon />, label: 'Verified Partner', color: '#4caf50' },
  ];

  const renderMap = () => {
    if (mapError) {
      return (
        <Box
          sx={{
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Map is currently unavailable
          </Typography>
        </Box>
      );
    }

    return (
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        onError={handleMapError}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={3}
          options={{
            styles: [
              {
                featureType: 'all',
                elementType: 'all',
                stylers: [
                  { invert_lightness: true },
                  { saturation: 10 },
                  { lightness: 30 },
                  { gamma: 0.5 },
                  { hue: '#43e97b' },
                ],
              },
            ],
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              onClick={() => setSelectedLocation(location)}
            />
          ))}
          {selectedLocation && (
            <InfoWindow
              position={selectedLocation.position}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {selectedLocation.name}
                </Typography>
                <Typography variant="body2">
                  {selectedLocation.address}
                </Typography>
                <Typography variant="body2">
                  {selectedLocation.phone}
                </Typography>
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#111',
      color: '#fff',
      py: 8 
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Get in touch with our team for any questions, support, or partnership inquiries
          </Typography>
        </motion.div>

        {/* Quick Links */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={2} justifyContent="center">
            {quickLinks.map((link, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.9)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    {React.cloneElement(link.icon, { 
                      sx: { fontSize: 32, color: link.color, mb: 1 } 
                    })}
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      {link.label}
              </Typography>
                  </Paper>
                </motion.div>
          </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                  Get in Touch
              </Typography>
                {contactInfo.map((info, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 3,
                      p: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        mr: 2,
                        p: 1,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(info.icon, {
                        sx: { color: info.color, fontSize: 24 },
                      })}
                    </Box>
                  <Box>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 0.5 }}>
                        {info.title}
                    </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {info.content}
                    </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                  <IconButton 
                        href={social.url}
                    target="_blank"
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: social.color,
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)',
                          },
                        }}
                      >
                        {social.icon}
                  </IconButton>
                    </motion.div>
                  ))}
              </Box>
            </Paper>
            </motion.div>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper
                sx={{
                  p: 4,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                Send us a Message
              </Typography>
                <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#43e97b',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                        label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#43e97b',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#43e97b',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                        label="Message"
                        name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#43e97b',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                          endIcon={<SendIcon />}
                          sx={{
                            background: 'linear-gradient(45deg, #43e97b 30%, #38f9d7 90%)',
                            color: '#000',
                            fontWeight: 600,
                            py: 1.5,
                            px: 4,
                            '&:hover': {
                              background: 'linear-gradient(45deg, #38f9d7 30%, #43e97b 90%)',
                            },
                          }}
                    >
                      Send Message
                    </Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </form>
            </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Box sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper
              sx={{
                p: 4,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                Our Global Offices
          </Typography>
              {renderMap()}
          </Paper>
          </motion.div>
        </Box>

        {/* Additional Features Section */}
        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%',
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                    Why Choose Us?
                  </Typography>
                  <List>
                    {[
                      '24/7 Customer Support',
                      'Global Network Coverage',
                      'Real-time Tracking',
                      'Secure Transactions',
                      'Expert Team',
                      'Fast Response Time',
                    ].map((item, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemIcon>
                          <VerifiedIcon sx={{ color: '#43e97b' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
                          sx={{ color: '#fff' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%',
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                    Business Hours
          </Typography>
                  <List>
                    {[
                      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                      { day: 'Sunday', hours: 'Closed' },
                      { day: 'Holidays', hours: 'By Appointment' },
                    ].map((item, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemIcon>
                          <AccessTimeIcon sx={{ color: '#ffb300' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.day}
                          secondary={item.hours}
                          primaryTypographyProps={{ color: '#fff' }}
                          secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: snackbar.severity === 'success' ? '#43e97b' : '#ff5e62',
            },
          }}
        >
            {snackbar.message}
          </Alert>
        </Snackbar>
    </Box>
  );
};

export default Contact; 