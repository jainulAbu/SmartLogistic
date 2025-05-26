import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const marketData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Market Growth',
      data: [65, 78, 90, 85, 95, 100],
      borderColor: '#43e97b',
      backgroundColor: 'rgba(67, 233, 123, 0.1)',
      tension: 0.4,
    },
  ],
};

const marketStats = [
  { 
    title: 'Market Size', 
    value: '$500B+', 
    icon: TrendingUpIcon,
    color: '#43e97b'
  },
  { 
    title: 'Active Users', 
    value: '1M+', 
    icon: LocalShippingIcon,
    color: '#4facfe'
  },
  { 
    title: 'Revenue Growth', 
    value: '45%', 
    icon: AttachMoneyIcon,
    color: '#f6d365'
  },
  { 
    title: 'Delivery Speed', 
    value: '2.5x', 
    icon: SpeedIcon,
    color: '#fa709a'
  },
];

const marketTableData = [
  { category: 'E-commerce', growth: '35%', marketShare: '40%', trend: 'Up' },
  { category: 'Food Delivery', growth: '28%', marketShare: '25%', trend: 'Up' },
  { category: 'B2B Logistics', growth: '42%', marketShare: '20%', trend: 'Up' },
  { category: 'Last Mile', growth: '30%', marketShare: '15%', trend: 'Up' },
];

const Market = () => {
  return (
    <Box sx={{ bgcolor: '#111', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" align="center" sx={{ color: '#fff', fontWeight: 700, mb: 4 }}>
            Market Insights
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: '#aaa', mb: 8 }}>
            Discover the latest trends and opportunities in the logistics market
          </Typography>
        </motion.div>

        {/* Market Stats */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {marketStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: '#222',
                      color: '#fff',
                      height: '100%',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <Box sx={{ color: stat.color, mb: 2 }}>
                      <Icon />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#aaa' }}>
                      {stat.title}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Market Growth Chart */}
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
            <Typography variant="h5" sx={{ color: '#fff', mb: 4 }}>
              Market Growth Trends
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line
                data={marketData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: '#fff',
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        color: '#fff',
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                    x: {
                      ticks: {
                        color: '#fff',
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </motion.div>

        {/* Market Categories Table */}
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
              mb: 8,
            }}
          >
            <Typography variant="h5" sx={{ color: '#fff', mb: 4 }}>
              Market Categories Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Growth Rate</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Market Share</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marketTableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: '#fff' }}>{row.category}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{row.growth}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{row.marketShare}</TableCell>
                      <TableCell sx={{ color: '#43e97b' }}>{row.trend}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
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
            <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
              Ready to Join the Market?
            </Typography>
            <Typography variant="body1" sx={{ color: '#aaa', mb: 4 }}>
              Start your journey with us and tap into the growing logistics market
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

export default Market; 