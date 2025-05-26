import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, Grid } from '@mui/material';

const Signup = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: '#111', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 5, bgcolor: '#fff', borderRadius: 4, boxShadow: 3, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: '#111' }}>
            Sign Up
          </Typography>
          <Typography variant="h6" sx={{ color: '#333', mb: 4 }}>
            Choose your account type to get started:
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: '#111', color: '#fff', fontWeight: 700, py: 2, fontSize: '1.1rem', mb: 2, '&:hover': { bgcolor: '#222' } }}
                onClick={() => navigate('/register/admin')}
              >
                Admin Sign Up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: '#222', color: '#fff', fontWeight: 700, py: 2, fontSize: '1.1rem', mb: 2, '&:hover': { bgcolor: '#111' } }}
                onClick={() => navigate('/register/vendor')}
              >
                Vendor Sign Up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: '#333', color: '#fff', fontWeight: 700, py: 2, fontSize: '1.1rem', '&:hover': { bgcolor: '#111' } }}
                onClick={() => navigate('/register/driver')}
              >
                Driver Sign Up
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup; 