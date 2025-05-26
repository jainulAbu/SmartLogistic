import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Map as MapIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <TruckIcon />,
    title: 'Real-time Tracking',
    description: 'Track your shipments with GPS precision and get instant updates on delivery status.',
    color: '#1976d2'
  },
  {
    icon: <SpeedIcon />,
    title: 'Route Optimization',
    description: 'AI-powered route planning to reduce fuel costs and delivery time.',
    color: '#ffb300'
  },
  {
    icon: <SecurityIcon />,
    title: 'Secure Platform',
    description: 'Advanced security measures to protect your data and transactions.',
    color: '#43e97b'
  },
  {
    icon: <AnalyticsIcon />,
    title: 'Smart Analytics',
    description: 'Comprehensive analytics dashboard for better business insights.',
    color: '#ff5e62'
  },
  {
    icon: <MapIcon />,
    title: 'Global Coverage',
    description: 'Extensive network covering multiple countries and regions.',
    color: '#7e57c2'
  },
  {
    icon: <SupportIcon />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your logistics needs.',
    color: '#ff7043'
  }
];

const Features = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      pt: 8,
      pb: 8
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
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Our Features
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 8,
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            Discover the powerful features that make our logistics platform stand out
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: `rgba(${feature.color}, 0.1)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: { fontSize: 32, color: feature.color }
                      })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features; 