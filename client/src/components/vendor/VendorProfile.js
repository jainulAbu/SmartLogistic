import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import AppBackground from '../layout/AppBackground';
import VendorNavbar from '../layout/VendorNavbar';

const VendorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    name: '',
    goodsTypes: [],
  });
  const [originalData, setOriginalData] = useState(null);
  const { currentUser } = useAuth();
  const db = getFirestore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        const vendorDoc = await getDoc(doc(db, 'vendors', currentUser.uid));
        if (vendorDoc.exists()) {
          const data = vendorDoc.data();
          setProfileData({
            displayName: data.displayName || '',
            email: data.email || '',
            phone: data.phone || '',
            companyName: data.companyName || '',
            address: data.address || '',
            businessType: data.businessType || '',
            registrationNumber: data.registrationNumber || '',
            taxId: data.taxId || '',
            name: data.name || '',
            goodsTypes: data.goodsTypes || [],
          });
          setOriginalData(data);
        }
      }
    };

    fetchProfileData();
  }, [currentUser, db]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'vendors', currentUser.uid), profileData);
      setOriginalData(profileData);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle image upload logic here
    }
  };

  return (
    <AppBackground>
      <VendorNavbar />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)', py: 4 }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ 
          p: 3, 
            background: 'rgba(17, 17, 17, 0.95)',
            color: '#fff',
          borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
              Profile Information
            </Typography>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                sx={{
                    background: '#4caf50',
                    color: '#fff',
                  '&:hover': {
                      background: '#388e3c',
                  },
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                      background: '#4caf50',
                      color: '#fff',
                    '&:hover': {
                        background: '#388e3c',
                    },
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{
                      color: '#4caf50',
                      borderColor: '#4caf50',
                    '&:hover': {
                        borderColor: '#388e3c',
                        background: 'rgba(76, 175, 80, 0.08)',
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

            {/* Alerts */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  background: 'rgba(211, 47, 47, 0.1)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                  '& .MuiAlert-icon': {
                    color: '#ff6b6b'
                  }
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  background: 'rgba(76, 175, 80, 0.1)',
                  color: '#4caf50',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  '& .MuiAlert-icon': {
                    color: '#4caf50'
                  }
                }}
              >
                {success}
              </Alert>
            )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={currentUser?.photoURL}
                  alt={profileData.displayName}
                  sx={{
                    width: 150,
                    height: 150,
                      border: '4px solid #4caf50',
                      bgcolor: '#23272f',
                  }}
                />
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                        bgcolor: '#4caf50',
                        '&:hover': { bgcolor: '#388e3c' },
                    }}
                  >
                    <PhotoCameraIcon sx={{ color: 'white' }} />
                  </IconButton>
                )}
              </Box>
                <Typography variant="h6" sx={{ color: '#fff', mt: 2 }}>
                {profileData.displayName}
              </Typography>
                <Typography variant="body2" sx={{ color: '#4caf50' }}>
                {profileData.businessType}
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                  {[
                    { label: 'Name', name: 'name', value: profileData.name },
                    { label: 'Email', name: 'email', value: profileData.email },
                    { label: 'Phone', name: 'phone', value: profileData.phone },
                    { label: 'Company Name', name: 'companyName', value: profileData.companyName },
                    { label: 'Business Type', name: 'businessType', value: profileData.businessType },
                    { label: 'Registration Number', name: 'registrationNumber', value: profileData.registrationNumber },
                    { label: 'Tax ID', name: 'taxId', value: profileData.taxId },
                  ].map((field, idx) => (
                    <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                        label={field.label}
                        name={field.name}
                        value={field.value}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                            color: '#fff',
                        '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                              borderColor: '#4caf50',
                        },
                            '&.Mui-focused fieldset': {
                              borderColor: '#4caf50',
                        },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                        },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4caf50',
                      },
                    }}
                  />
                </Grid>
                  ))}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    multiline
                    rows={2}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                          color: '#fff',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                            borderColor: '#4caf50',
                        },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4caf50',
                        },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255,255,255,0.7)',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#4caf50',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ color: '#4caf50', mb: 1 }}>
                    Goods Types
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(profileData.goodsTypes || []).map((type, idx) => (
                        <Chip key={idx} label={type} sx={{ bgcolor: '#23272f', color: '#4caf50', border: '1px solid #4caf50' }} />
                    ))}
    </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      </Box>
    </AppBackground>
  );
};

export default VendorProfile; 