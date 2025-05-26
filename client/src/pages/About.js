import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const About = () => (
  <Box sx={{ bgcolor: '#111', minHeight: '100vh', py: 8 }}>
    <Container maxWidth="md">
      <Paper sx={{ p: 5, bgcolor: '#fff', borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 3, color: '#111' }}>
          About Us
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: '#333', mb: 4 }}>
          Learn more about our mission, vision, and the team behind our logistics platform.
        </Typography>
        <Typography variant="body1" sx={{ color: '#444' }}>
          We are dedicated to revolutionizing logistics through technology, transparency, and customer-centric solutions. Our team is passionate about making global supply chains smarter and more efficient.
        </Typography>
      </Paper>
    </Container>
  </Box>
);

export default About; 