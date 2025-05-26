import React, { useState } from 'react';
import AppBackground from '../layout/AppBackground';
import VendorNavbar from '../layout/VendorNavbar';
import { Container, Typography, Paper, Tabs, Tab, Box } from '@mui/material';
import DeliveryList from './DeliveryList';
import PaymentStatus from './PaymentStatus';

const VendorCompletedDeliveries = () => {
  const [tab, setTab] = useState(0);

  return (
    <AppBackground>
      <VendorNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, background: 'rgba(17, 17, 17, 0.95)', color: '#fff', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Deliveries Overview
          </Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Completed" />
            <Tab label="Rejected" />
            <Tab label="Pending" />
          </Tabs>
          {tab === 0 && (
            <DeliveryList type="completed" extraComponent={PaymentStatus} />
          )}
          {tab === 1 && (
            <DeliveryList type="rejected" extraComponent={PaymentStatus} />
          )}
          {tab === 2 && (
            <DeliveryList type="pending" extraComponent={PaymentStatus} />
          )}
        </Paper>
      </Container>
    </AppBackground>
  );
};

export default VendorCompletedDeliveries; 