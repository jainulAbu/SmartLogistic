import React from 'react';
import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import VendorNavbar from '../layout/VendorNavbar';

const VendorReports = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
      color: '#fff',
      py: 4
    }}>
      <VendorNavbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Card sx={{ 
          background: 'rgba(17, 17, 17, 0.95)',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
          }
        }}>
          <CardContent>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                color: '#fff',
                fontWeight: 700,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  textShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
                }
              }}
            >
              Reports
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  color: '#fff',
                  transform: 'translateX(10px)'
                }
              }}
            >
              This is the reports page for vendors.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default VendorReports; 