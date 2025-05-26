import React from 'react';
import { Box } from '@mui/material';

const AppBackground = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: '#111', // solid dark background
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  );
};

export default AppBackground; 