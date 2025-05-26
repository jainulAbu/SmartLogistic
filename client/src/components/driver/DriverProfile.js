import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StarIcon from '@mui/icons-material/Star';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import AppBackground from '../layout/AppBackground';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import DriverNavbar from '../layout/DriverNavbar';

const glassCardStyle = {
  p: 4,
  width: '100%',
  borderRadius: 5,
  background: 'rgba(17, 17, 17, 0.95)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(67,233,123,0.15)',
  color: '#fff',
  fontWeight: 700,
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  '&:hover': {
    boxShadow: '0 8px 32px 0 rgba(67,233,123,0.25)',
    borderColor: '#43e97b',
    transform: 'translateY(-2px) scale(1.01)',
  },
};

const statChipStyle = {
  bgcolor: 'rgba(67,233,123,0.08)',
  color: '#43e97b',
  fontWeight: 700,
  border: '1px solid #43e97b',
  mr: 1,
  mb: 1
};

const DriverProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleCapacity: '',
    experience: '',
    address: '',
    avatarUrl: '',
    rating: 4.5,
    deliveries: 0,
    licenseStatus: 'Verified',
    insuranceStatus: 'Pending',
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { currentUser } = useAuth();
  const db = getFirestore();
  const storage = getStorage();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    if (!currentUser) return;
    setLoadingProfile(true);
    try {
      const driverRef = doc(db, 'drivers', currentUser.uid);
      const driverDoc = await getDoc(driverRef);
      if (driverDoc.exists()) {
        const data = driverDoc.data();
        setProfile({
          ...data,
          avatarUrl: data.avatarUrl || '',
          rating: data.rating || 4.5,
          deliveries: data.deliveries || 0,
          licenseStatus: data.licenseStatus || 'Verified',
          insuranceStatus: data.insuranceStatus || 'Pending',
        });
        setOriginalProfile({ ...data, avatarUrl: data.avatarUrl || '' });
        setPreview(data.avatarUrl || '');
      }
    } catch (error) {
      setError('Failed to fetch profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setPreview(originalProfile.avatarUrl);
    setImage(null);
    setEditMode(false);
    setSuccess('');
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let avatarUrl = profile.avatarUrl;
      if (image) {
        const storageRef = ref(storage, `driver-avatars/${currentUser.uid}/${image.name}`);
        await uploadBytes(storageRef, image);
        avatarUrl = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(db, 'drivers', currentUser.uid), {
        ...profile,
        avatarUrl,
      });
      setSuccess('Profile updated successfully!');
      setProfile((prev) => ({ ...prev, avatarUrl }));
      setOriginalProfile({ ...profile, avatarUrl });
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const registerDriver = async (formData) => {
    const auth = getAuth();
    const db = getFirestore();
    const { email, password, ...profileData } = formData;
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    // 2. Save profile in Firestore
    await setDoc(doc(db, 'drivers', uid), profileData);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)' }}>
      <DriverNavbar />
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ color: '#43e97b', fontWeight: 700, mb: 4, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Driver Profile
          </Typography>
          <Paper sx={glassCardStyle}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={preview || profile.avatarUrl}
                alt="Driver Profile Image"
                sx={{ width: 100, height: 100, mb: 2, border: '3px solid #43e97b', bgcolor: 'rgba(67,233,123,0.08)' }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#43e97b', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {profile.name || 'No Name'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip icon={<StarIcon sx={{ color: '#43e97b' }} />} label={`Rating: ${profile.rating}`} sx={statChipStyle} />
                <Chip icon={<VerifiedUserIcon sx={{ color: '#43e97b' }} />} label={`License: ${profile.licenseStatus}`} sx={statChipStyle} />
                <Chip label={`Deliveries: ${profile.deliveries}`} sx={statChipStyle} />
                <Chip label={`Insurance: ${profile.insuranceStatus}`} sx={statChipStyle} />
              </Box>
            </Box>
            {success && <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
            {loadingProfile ? (
              <CircularProgress sx={{ color: '#43e97b', my: 4 }} />
            ) : editMode ? (
              <Box component="form" onSubmit={handleSave} sx={{ width: '100%', mt: 1 }}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mb: 2, background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', fontWeight: 600 }}
                >
                  Upload Profile Image
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="License Number"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Vehicle Type"
                  name="vehicleType"
                  value={profile.vehicleType}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Vehicle Number"
                  name="vehicleNumber"
                  value={profile.vehicleNumber}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Vehicle Model"
                  name="vehicleModel"
                  value={profile.vehicleModel}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Vehicle Capacity (tons)"
                  name="vehicleCapacity"
                  value={profile.vehicleCapacity}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Experience (years)"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  disabled={!editMode}
                  InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff', fontWeight: 700 } }}
                  InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : <SaveIcon />}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                      color: '#fff',
                      boxShadow: '0 2px 12px 0 #43e97b44',
                      textTransform: 'none',
                      letterSpacing: 1,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                      },
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      color: '#43e97b',
                      borderColor: '#43e97b',
                      textTransform: 'none',
                      letterSpacing: 1,
                      '&:hover': {
                        background: 'rgba(67,233,123,0.08)',
                        borderColor: '#38f9d7',
                        color: '#38f9d7',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                  {profile.name || 'No Name'}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <b>Phone:</b> {profile.phone || 'N/A'}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <b>License Number:</b> {profile.licenseNumber || 'N/A'}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <b>Address:</b> {profile.address || 'N/A'}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <b>Vehicle Type:</b> {profile.vehicleType || 'N/A'}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <b>Vehicle Number:</b> {profile.vehicleNumber || 'N/A'}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <b>Vehicle Model:</b> {profile.vehicleModel || 'N/A'}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <b>Vehicle Capacity (tons):</b> {profile.vehicleCapacity || 'N/A'}
                </Typography>
                <Typography sx={{ color: '#fff', mb: 1 }}>
                  <b>Experience (years):</b> {profile.experience || 'N/A'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<EditIcon />}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                      color: '#fff',
                      boxShadow: '0 2px 12px 0 #43e97b44',
                      textTransform: 'none',
                      letterSpacing: 1,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                      },
                    }}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default DriverProfile; 