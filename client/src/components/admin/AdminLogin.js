import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is an admin
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        // If not an admin, sign out and show error
        await auth.signOut();
        setError('Access denied. Admin privileges required.');
        return;
      }

      // If admin, redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      color: '#fff', 
      bgcolor: '#111',
      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)' 
    }}>
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: '#fff',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 4,
            background: 'rgba(17, 17, 17, 0.95)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <AdminPanelSettingsIcon sx={{ 
            fontSize: 56, 
            color: '#4caf50', 
            mb: 2, 
            boxShadow: '0 2px 12px rgba(76, 175, 80, 0.3)', 
            borderRadius: '50%', 
            bgcolor: 'rgba(76, 175, 80, 0.1)', 
            p: 1 
          }} />
          <Typography component="h1" variant="h4" gutterBottom sx={{ 
            fontWeight: 700, 
            letterSpacing: 1, 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Admin Sign In
        </Typography>
          {error && (
            <Alert severity="error" sx={{ 
              mb: 2, 
              width: '100%',
              bgcolor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(211, 47, 47, 0.2)'
            }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
              margin="normal"
              required
            fullWidth
              label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
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
            margin="normal"
            required
            fullWidth
            label="Password"
              type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#4caf50' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Button
            fullWidth
            variant="text"
              onClick={() => navigate('/register/admin')}
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
            Don't have an admin account? Register here
          </Button>
        </Box>
        </Box>
    </Container>
    </Box>
  );
};

export default AdminLogin; 