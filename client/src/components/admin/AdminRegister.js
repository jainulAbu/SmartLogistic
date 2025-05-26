import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set user role as admin in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        role: 'admin',
        createdAt: new Date().toISOString()
      });

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      mt: 8, 
      background: '#111',
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4
    }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 4, 
        background: 'rgba(17, 17, 17, 0.95)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        width: '100%'
      }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            color: '#fff',
            fontWeight: 700,
            mb: 4,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Admin Registration
        </Typography>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              bgcolor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(211, 47, 47, 0.2)'
            }}
          >
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
                required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4caf50',
              },
            }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
                required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4caf50',
              },
            }}
          />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
                required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4caf50',
              },
            }}
              />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 4,
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)',
              color: '#fff',
              fontWeight: 700,
              letterSpacing: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(90deg, #45a049 0%, #4caf50 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              },
              '&:disabled': {
                background: 'rgba(76, 175, 80, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/admin/login')}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 600,
              letterSpacing: 0.5,
              py: 1,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Already have an admin account? Sign in here
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminRegister; 