import React from 'react';
import { Container, Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import AppBackground from '../layout/AppBackground';

const drivers = [
  { name: 'Alice', email: 'alice@example.com', phone: '1234567890', status: 'Active' },
  { name: 'Bob', email: 'bob@example.com', phone: '9876543210', status: 'Inactive' },
];

const DriversList = () => (
  <AppBackground>
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{
        p: 4,
        borderRadius: 5,
        background: 'rgba(255,255,255,0.10)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255,255,255,0.18)',
        borderImage: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) 1',
        color: '#fff',
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Total Drivers</Typography>
        <Paper sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>{driver.name}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{driver.email}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{driver.phone}</TableCell>
                  <TableCell sx={{ color: '#43e97b', fontWeight: 700 }}>{driver.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  </AppBackground>
);

export default DriversList; 