import React from 'react';
import { Container, Typography, Button, Grid, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LocalShipping as TruckIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'For Vendors',
      description: 'Post loads, find vehicles, and manage your shipments efficiently.',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/register?role=vendor'),
    },
    {
      title: 'For Drivers',
      description: 'Find loads, manage your vehicles, and track your earnings.',
      icon: <TruckIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/register?role=driver'),
    },
    {
      title: 'For Administrators',
      description: 'Monitor platform activity and manage users and vehicles.',
      icon: <AdminIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/register?role=admin'),
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Logistics App
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connect with reliable transportation partners and streamline your logistics operations
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Button variant="outlined" onClick={feature.action}>
                  Register as {feature.title.split(' ')[1]}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Login Now
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage; 