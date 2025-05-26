import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Fade,
  Zoom,
  Slide,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';

const TruckSVG = ({ position }) => (
  <svg width="120" height="60" style={{ position: 'absolute', left: `${position}%`, bottom: 30, transition: 'left 0.05s linear', zIndex: 2 }}>
    {/* Truck body */}
    <rect x="10" y="20" width="60" height="25" rx="6" fill="#1976d2" />
    {/* Truck cabin */}
    <rect x="70" y="28" width="30" height="17" rx="4" fill="#ffb300" />
    {/* Wheels */}
    <circle cx="25" cy="48" r="7" fill="#333" />
    <circle cx="65" cy="48" r="7" fill="#333" />
    <circle cx="90" cy="48" r="7" fill="#333" />
    {/* Window */}
    <rect x="80" y="32" width="12" height="8" rx="2" fill="#fff" />
  </svg>
);

const RoadSVG = () => (
  <svg width="100%" height="40" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1 }}>
    <rect x="0" y="20" width="100%" height="20" fill="url(#roadGradient)" />
    <defs>
      <linearGradient id="roadGradient" x1="0" y1="0" x2="100%" y2="0">
        <stop offset="0%" stopColor="#333" />
        <stop offset="100%" stopColor="#444" />
      </linearGradient>
    </defs>
    {/* Lane lines */}
    {[...Array(20)].map((_, i) => (
      <rect key={i} x={i * 60 + 10} y="30" width="30" height="4" fill="#fff" opacity="0.7" />
    ))}
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const [truckPosition, setTruckPosition] = useState(-10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTruckPosition(prev => (prev >= 90 ? -10 : prev + 0.5));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
        animation: 'shine 3s infinite',
      }
    }}>
      {/* Navigation Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          boxShadow: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                LOGISTICS APP
              </Typography>
            </Box>
            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ mr: 2, fontWeight: 600 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 600 }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Hero Section with Animated Truck */}
        <Box
          sx={{
            mt: { xs: 12, md: 16 },
            mb: 8,
            position: 'relative',
            height: '340px',
            overflow: 'visible',
            borderRadius: 6,
            background: 'linear-gradient(120deg, #1976d2 0%, #ffb300 100%)',
            boxShadow: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 3, width: '100%' }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #fff 30%, #ffb300 60%, #fff 100%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2.2rem', md: '3.5rem' },
                  letterSpacing: 2,
                }}
              >
                Welcome to Logistics App
              </Typography>
              <Typography variant="h5" color="#fff" paragraph sx={{ mb: 4, fontWeight: 400 }}>
                Your one-stop solution for efficient logistics management
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  px: 5, py: 1.5, fontWeight: 700, fontSize: '1.2rem',
                  background: 'linear-gradient(90deg, #ffb300 0%, #1976d2 100%)',
                  color: '#fff',
                  boxShadow: 4,
                  '&:hover': { background: 'linear-gradient(90deg, #1976d2 0%, #ffb300 100%)' }
                }}
              >
                Get Started
              </Button>
            </Box>
          </Fade>
          {/* Animated Truck and Road */}
          <TruckSVG position={truckPosition} />
          <RoadSVG />
        </Box>

        {/* Stats Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={3}>
            <Fade in timeout={1000}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #42a5f5 0%, #7e57c2 100%)',
                  color: 'white',
                  borderRadius: 4,
                  boxShadow: 4,
                }}
              >
                <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">10,000+</Typography>
                <Typography variant="body1">Active Users</Typography>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={3}>
            <Fade in timeout={1500}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #ffb300 0%, #ff7043 100%)',
                  color: 'white',
                  borderRadius: 4,
                  boxShadow: 4,
                }}
              >
                <LocalShippingIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">50,000+</Typography>
                <Typography variant="body1">Deliveries</Typography>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={3}>
            <Fade in timeout={2000}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  borderRadius: 4,
                  boxShadow: 4,
                }}
              >
                <StarIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">4.8/5</Typography>
                <Typography variant="body1">User Rating</Typography>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={3}>
            <Fade in timeout={2500}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)',
                  color: 'white',
                  borderRadius: 4,
                  boxShadow: 4,
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">15+</Typography>
                <Typography variant="body1">Cities Covered</Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>

        {/* Role Selection Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Slide direction="right" in timeout={1000}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: 6,
                  background: 'linear-gradient(120deg, #fff 60%, #e3f2fd 100%)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: 12,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <PersonIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h4" component="h2" gutterBottom align="center">
                    Vendor
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Manage your shipments, track deliveries, and connect with reliable drivers.
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Easy shipment management" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Real-time tracking" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Secure payments" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/register?role=vendor')}
                    sx={{ mr: 2, fontWeight: 600 }}
                  >
                    Register as Vendor
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/login?role=vendor')}
                    sx={{ fontWeight: 600 }}
                  >
                    Login as Vendor
                  </Button>
                </CardActions>
              </Card>
            </Slide>
          </Grid>

          <Grid item xs={12} md={6}>
            <Slide direction="left" in timeout={1000}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: 6,
                  background: 'linear-gradient(120deg, #fff 60%, #fce4ec 100%)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: 12,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <DirectionsCarIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h4" component="h2" gutterBottom align="center">
                    Driver
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Find loads, manage deliveries, and grow your business.
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Flexible working hours" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Competitive earnings" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Route optimization" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/register?role=driver')}
                    sx={{ mr: 2, fontWeight: 600 }}
                  >
                    Register as Driver
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/login?role=driver')}
                    sx={{ fontWeight: 600 }}
                  >
                    Login as Driver
                  </Button>
                </CardActions>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6, fontWeight: 700, color: '#1976d2' }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Fade in timeout={1000}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #42a5f5 0%, #7e57c2 100%)',
                  color: 'white',
                  boxShadow: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 8,
                  },
                }}
              >
                <SecurityIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Secure Platform
                </Typography>
                <Typography variant="body1" color="inherit">
                  Your data and transactions are protected with advanced security measures
                </Typography>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={4}>
            <Fade in timeout={1500}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ffb300 0%, #ff7043 100%)',
                  color: 'white',
                  boxShadow: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 8,
                  },
                }}
              >
                <SpeedIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Real-time Tracking
                </Typography>
                <Typography variant="body1" color="inherit">
                  Track your shipments and deliveries in real-time with our advanced tracking system
                </Typography>
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={4}>
            <Fade in timeout={2000}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  boxShadow: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 8,
                  },
                }}
              >
                <SupportIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  24/7 Support
                </Typography>
                <Typography variant="body1" color="inherit">
                  Our dedicated support team is available round the clock to assist you
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>

        {/* Additional Features */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Slide direction="up" in timeout={1000}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(120deg, #fff 60%, #e3f2fd 100%)',
                  boxShadow: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">
                    Smart Route Optimization
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Our platform uses advanced algorithms to optimize delivery routes, saving time and fuel costs.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
          <Grid item xs={12} md={6}>
            <Slide direction="up" in timeout={1500}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(120deg, #fff 60%, #fce4ec 100%)',
                  boxShadow: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">
                    Secure Payments
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Multiple payment options with secure transaction processing for all your logistics needs.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
          <Grid item xs={12} md={6}>
            <Slide direction="up" in timeout={2000}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(120deg, #fff 60%, #e3f2fd 100%)',
                  boxShadow: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">
                    Detailed Analytics
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Access comprehensive analytics and reports to optimize your logistics operations.
                </Typography>
              </Paper>
            </Slide>
          </Grid>
        </Grid>

        {/* Testimonials Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
            What Our Users Say
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Fade in timeout={1000}>
                <Paper sx={{ p: 3, height: '100%', borderRadius: 4, boxShadow: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>JD</Avatar>
                    <Box>
                      <Typography variant="h6">John Doe</Typography>
                      <Typography variant="body2" color="text.secondary">Vendor</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1">
                    "The platform has revolutionized how we handle our logistics. The real-time tracking feature is a game-changer!"
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
            <Grid item xs={12} md={4}>
              <Fade in timeout={1500}>
                <Paper sx={{ p: 3, height: '100%', borderRadius: 4, boxShadow: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>AS</Avatar>
                    <Box>
                      <Typography variant="h6">Alice Smith</Typography>
                      <Typography variant="body2" color="text.secondary">Driver</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1">
                    "As a driver, I love the flexibility and the steady stream of delivery opportunities. The app is very user-friendly!"
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
            <Grid item xs={12} md={4}>
              <Fade in timeout={2000}>
                <Paper sx={{ p: 3, height: '100%', borderRadius: 4, boxShadow: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>RJ</Avatar>
                    <Box>
                      <Typography variant="h6">Robert Johnson</Typography>
                      <Typography variant="body2" color="text.secondary">Vendor</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1">
                    "The route optimization feature has helped us save on fuel costs and improve delivery times significantly."
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(45deg, #1976d2 30%, #ffb300 90%)',
            borderRadius: 4,
            color: 'white',
            mb: 8,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 8,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
              animation: 'shine 3s infinite',
            },
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" paragraph>
            Join our platform today and experience the future of logistics
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '1.2rem',
              px: 5,
              py: 1.5,
              boxShadow: 4,
              '&:hover': {
                bgcolor: 'grey.100',
                color: '#1976d2',
              },
            }}
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>

      {/* Add keyframes for animations */}
      <style>
        {`
          @keyframes roadMove {
            0% { background-position: 0 0; }
            100% { background-position: 100% 0; }
          }
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </Box>
  );
};

export default Home; 