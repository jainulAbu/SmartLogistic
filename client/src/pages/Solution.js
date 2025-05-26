import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SupportIcon from '@mui/icons-material/Support';
import VerifiedIcon from '@mui/icons-material/Verified';

const solutions = [
  {
    title: 'Smart Logistics',
    icon: <LocalShippingIcon />,
    features: [
      'Real-time tracking and monitoring',
      'Automated route optimization',
      'Smart load matching',
      'Predictive analytics',
    ],
    color: '#43e97b',
  },
  {
    title: 'Performance Analytics',
    icon: <AnalyticsIcon />,
    features: [
      'Comprehensive dashboards',
      'Custom reporting tools',
      'Performance metrics',
      'Data visualization',
    ],
    color: '#4facfe',
  },
  {
    title: 'Security & Compliance',
    icon: <SecurityIcon />,
    features: [
      'End-to-end encryption',
      'Compliance monitoring',
      'Secure payments',
      'Data protection',
    ],
    color: '#f6d365',
  },
  {
    title: 'Customer Support',
    icon: <SupportIcon />,
    features: [
      '24/7 support team',
      'Multi-channel support',
      'Knowledge base',
      'Training resources',
    ],
    color: '#fa709a',
  },
];

const benefits = [
  {
    title: 'Increased Efficiency',
    description: 'Optimize operations and reduce delivery times by up to 40%',
    icon: <SpeedIcon />,
  },
  {
    title: 'Cost Reduction',
    description: 'Save up to 30% on operational costs through smart optimization',
    icon: <VerifiedIcon />,
  },
  {
    title: 'Better Visibility',
    description: 'Real-time tracking and monitoring of all logistics operations',
    icon: <AnalyticsIcon />,
  },
];

const Solution = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#111', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" align="center" sx={{ color: '#fff', fontWeight: 700, mb: 4 }}>
            Our Solutions
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: '#aaa', mb: 8 }}>
            Comprehensive logistics solutions for modern businesses
          </Typography>
        </motion.div>

        {/* Solutions Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {solutions.map((solution, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    bgcolor: '#222',
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Box sx={{ color: solution.color, mb: 2 }}>{solution.icon}</Box>
                  <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>
                    {solution.title}
                  </Typography>
                  <List>
                    {solution.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ py: 1 }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: solution.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          sx={{ color: '#fff' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: '#222',
              mb: 8,
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', mb: 4 }}>
              Key Benefits
            </Typography>
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      bgcolor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      height: '100%',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ color: '#43e97b', mb: 2 }}>{benefit.icon}</Box>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        {benefit.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: '#222',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Ready to Transform Your Logistics?
            </Typography>
            <Typography variant="body1" sx={{ color: '#aaa', mb: 4 }}>
              Join thousands of businesses already using our solutions
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#43e97b',
                color: '#111',
                '&:hover': {
                  bgcolor: '#2ecc71',
                },
              }}
            >
              Get Started
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Solution; 