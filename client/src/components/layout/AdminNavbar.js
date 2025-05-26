import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ bgcolor: '#222', color: '#43e97b', boxShadow: 'none', borderBottom: '2px solid #43e97b' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2 }}>
          Admin Panel
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/admin/drivers')} sx={{ fontWeight: 600 }}>Total Drivers</Button>
          <Button color="inherit" onClick={() => navigate('/admin/vendors')} sx={{ fontWeight: 600 }}>Total Vendors</Button>
          <Button color="inherit" onClick={() => navigate('/admin/active-deliveries')} sx={{ fontWeight: 600 }}>Active Deliveries</Button>
          <Button color="inherit" onClick={() => navigate('/admin/completed-deliveries')} sx={{ fontWeight: 600}}>Completed Deliveries</Button>
          <Button color="inherit" onClick={() => navigate('/admin/profile')} sx={{ fontWeight: 600 }}>Profile</Button>
          <Button color="inherit" onClick={() => {
            localStorage.clear();
            navigate('/admin/login');
          }} sx={{ fontWeight: 600, color: '#dc004e', ml: 2 }}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar; 