import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import { initializeDatabase } from '../../utils/initializeData';

const InitializeData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInitialize = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await initializeDatabase();
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Initialize Sample Data
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This will add sample vehicles to the database. Use this only once to populate initial data.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Sample data initialized successfully!
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleInitialize}
        disabled={loading}
      >
        {loading ? 'Initializing...' : 'Initialize Sample Data'}
      </Button>
    </Box>
  );
};

export default InitializeData; 