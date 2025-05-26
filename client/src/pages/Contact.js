import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Contact = () => (
  <Box sx={{ bgcolor: '#111', minHeight: '100vh', py: 8 }}>
    <Container maxWidth="md">
      <Paper sx={{ p: 5, bgcolor: '#fff', borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 3, color: '#111' }}>
          Contact Us
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: '#333', mb: 4 }}>
          Get in touch with our team for support, partnership, or general inquiries.
        </Typography>
        <Typography variant="body1" sx={{ color: '#444' }}>
          Email: support@logisticsapp.com<br />
          Phone: +1 (555) 123-4567<br />
          Address: 123 Logistics Street, Business District, City, State 12345
        </Typography>
      </Paper>
    </Container>
  </Box>
);

export default Contact; 