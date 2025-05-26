import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Avatar,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { GalaxyBackground } from '../home/Home';

const Register = ({ role }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const db = getFirestore();
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showPasscodeError, setShowPasscodeError] = useState(false);

  // Get role from props, query, or path
  let userRole = role || new URLSearchParams(location.search).get('role');
  if (!userRole) {
    if (location.pathname.includes('/register/vendor')) userRole = 'vendor';
    else if (location.pathname.includes('/register/driver')) userRole = 'driver';
    else if (location.pathname.includes('/register/admin')) userRole = 'admin';
    else userRole = 'vendor'; // fallback
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: userRole,
    phone: '',
    businessType: '',
    goodsTypes: [],
    address: '',
    vehicleType: '',
    licenseNumber: '',
    vehicleCapacity: '',
    department: '',
    position: '',
  });

  const goodsTypesOptions = [
    'General Cargo',
    'Refrigerated Goods',
    'Hazardous Materials',
    'Bulk Cargo',
    'Liquid Cargo',
    'Construction Materials',
    'Agricultural Products',
    'Electronics',
    'Furniture',
    'Other'
  ];

  const vehicleTypes = [
    'Truck',
    'Van',
    'Pickup',
    'Trailer',
    'Container Truck',
    'Refrigerated Truck',
    'Other'
  ];

  const departments = [
    'Operations',
    'Customer Service',
    'Finance',
    'Human Resources',
    'IT',
    'Logistics',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (userRole === 'vendor' && (!formData.businessType || formData.goodsTypes.length === 0)) {
      setError('Please fill in all vendor-specific fields');
      return false;
    }

    if (userRole === 'driver' && (!formData.vehicleType || !formData.licenseNumber || !formData.vehicleCapacity)) {
      setError('Please fill in all driver-specific fields');
      return false;
    }

    if (userRole === 'admin' && (!formData.department || !formData.position)) {
      setError('Please fill in all admin-specific fields');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowPasscodeError(false);

    if (!validateForm()) {
      return;
    }

    if (userRole === 'admin' && adminPasscode !== '9677') {
      setShowPasscodeError(true);
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Create user document in Firestore with role-specific data
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        createdAt: new Date(),
        verified: false,
        blocked: false,
      };

      // Add role-specific fields
      if (userRole === 'vendor') {
        userData.businessType = formData.businessType;
        userData.goodsTypes = formData.goodsTypes;
      } else if (userRole === 'driver') {
        userData.vehicleType = formData.vehicleType;
        userData.licenseNumber = formData.licenseNumber;
        userData.vehicleCapacity = formData.vehicleCapacity;
      } else if (userRole === 'admin') {
        userData.department = formData.department;
        userData.position = formData.position;
      }

      await setDoc(doc(db, 'users', user.uid), userData);

      // After registration, redirect to the correct login page for the role
      if (formData.role === 'vendor') {
        navigate('/login/vendor');
      } else if (formData.role === 'driver') {
        navigate('/login/driver');
      } else if (formData.role === 'admin') {
        navigate('/admin/login');
      } else {
        navigate('/login/vendor');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (userRole) {
      case 'vendor':
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Business Type"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: 'rgba(156,146,172,0.08)',
                  borderRadius: 2,
                  color: '#4A4A4A',
                },
              }}
              InputLabelProps={{ style: { color: '#9C92AC' } }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#9C92AC' }}>Goods Types</InputLabel>
              <Select
                multiple
                name="goodsTypes"
                value={formData.goodsTypes}
                onChange={handleChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        sx={{ 
                          bgcolor: 'rgba(67,233,123,0.2)',
                          color: '#fff',
                          '& .MuiChip-deleteIcon': {
                            color: '#fff',
                            '&:hover': { color: '#43e97b' }
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(156,146,172,0.08)',
                    borderRadius: 2,
                    color: '#4A4A4A',
                  },
                }}
              >
                {goodsTypesOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 'driver':
        return (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#9C92AC' }}>Vehicle Type</InputLabel>
              <Select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(156,146,172,0.08)',
                    borderRadius: 2,
                    color: '#4A4A4A',
                  },
                }}
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: 'rgba(156,146,172,0.08)',
                  borderRadius: 2,
                  color: '#4A4A4A',
                },
              }}
              InputLabelProps={{ style: { color: '#9C92AC' } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Vehicle Capacity (tons)"
              name="vehicleCapacity"
              type="number"
              value={formData.vehicleCapacity}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: 'rgba(156,146,172,0.08)',
                  borderRadius: 2,
                  color: '#4A4A4A',
                },
              }}
              InputLabelProps={{ style: { color: '#9C92AC' } }}
            />
          </>
        );
      case 'admin':
        return (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#9C92AC' }}>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(156,146,172,0.08)',
                    borderRadius: 2,
                    color: '#4A4A4A',
                  },
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: 'rgba(156,146,172,0.08)',
                  borderRadius: 2,
                  color: '#4A4A4A',
                },
              }}
              InputLabelProps={{ style: { color: '#9C92AC' } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Admin Passcode"
              name="adminPasscode"
              type="password"
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: 'rgba(156,146,172,0.08)',
                  borderRadius: 2,
                  color: '#4A4A4A',
                },
              }}
              InputLabelProps={{ style: { color: '#9C92AC' } }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'vendor':
        return <BusinessIcon sx={{ fontSize: 32 }} />;
      case 'driver':
        return <LocalShippingIcon sx={{ fontSize: 32 }} />;
      case 'admin':
        return <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />;
      default:
        return <PersonAddIcon sx={{ fontSize: 32 }} />;
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
      <GalaxyBackground />
      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
            mt: 10,
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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
            <Avatar sx={{ m: 1, bgcolor: '#4caf50', width: 56, height: 56 }}>
              {getRoleIcon()}
            </Avatar>
            <Typography component="h1" variant="h4" gutterBottom sx={{ 
              fontWeight: 700, 
              letterSpacing: 1, 
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Register as {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
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
            {showPasscodeError && (
              <Alert severity="error" sx={{ 
                mb: 2, 
                width: '100%',
                bgcolor: 'rgba(211, 47, 47, 0.1)',
                color: '#ff6b6b',
                border: '1px solid rgba(211, 47, 47, 0.2)'
              }}>
                Incorrect admin passcode. Please try again.
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
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
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
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
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
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
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
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
              {renderRoleSpecificFields()}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
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
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
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
                {loading ? 'Creating Account...' : `Register as ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`}
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={() => {
                  if (userRole === 'vendor') {
                    navigate('/login/vendor');
                  } else if (userRole === 'driver') {
                    navigate('/login/driver');
                  } else if (userRole === 'admin') {
                    navigate('/admin/login');
                  } else {
                    navigate('/login/vendor');
                  }
                }}
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
                Already have an account? Sign In
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register; 