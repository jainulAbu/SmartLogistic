import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  useTheme 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const LandingPage = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Smart Logistics Solutions
          </Typography>
          <Typography variant="h5" paragraph>
            Connect with reliable transporters and optimize your logistics operations
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2 }}
              href="/register"
            >
              Register Now
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              href="/login"
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <LocalShippingIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Active Lorries
                </Typography>
                <Typography variant="h3" color="primary">
                  1,000+
                </Typography>
                <Typography color="text.secondary">
                  Verified vehicles ready for your shipments
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <SpeedIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Fuel Saved
                </Typography>
                <Typography variant="h3" color="primary">
                  25%
                </Typography>
                <Typography color="text.secondary">
                  Optimized routes reduce fuel consumption
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <AttachMoneyIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Money Saved
                </Typography>
                <Typography variant="h3" color="primary">
                  ₹50L+
                </Typography>
                <Typography color="text.secondary">
                  Cost savings for our customers
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            What Our Customers Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {/* Add testimonial cards here */}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Get in Touch
        </Typography>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            Email: support@logisticsapp.com
          </Typography>
          <Typography variant="body1" paragraph>
            Phone: +91 1234567890
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/contact"
          >
            Contact Us
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage; 