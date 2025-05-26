import React from 'react';
import { Box, Container, Typography, Grid, Paper, Divider, Button } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <BarChartIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Analytics Dashboard
          </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">10,000+</Typography>
              <Typography variant="body1">Active Users</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
              <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">50,000+</Typography>
              <Typography variant="body1">Deliveries</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
              <ShowChartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">15+</Typography>
              <Typography variant="body1">Cities Covered</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
              <StarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">4.8/5</Typography>
              <Typography variant="body1">User Rating</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 6 }} />
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Example Chart (Placeholder)
          </Typography>
          <img
            src="https://www.chartjs.org/media/logo-title.svg"
            alt="Chart Placeholder"
            style={{ width: 300, opacity: 0.3 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Integrate with Chart.js, Recharts, or any chart library for real analytics.
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/admin/dashboard')}>
            Back to Admin Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminAnalytics; 