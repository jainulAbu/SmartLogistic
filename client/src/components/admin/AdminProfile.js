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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../layout/AdminNavbar';
import AppBackground from '../layout/AppBackground';

const departments = [
  'Operations',
  'Customer Service',
  'Finance',
  'Human Resources',
  'IT',
  'Logistics',
  'Other'
];

const AdminProfile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatarUrl: '',
    phone: '',
    department: '',
    position: '',
    address: '',
    lastLogin: '',
    registeredAt: '',
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = {
          name: userDoc.data().name || '',
          email: userDoc.data().email || '',
          avatarUrl: userDoc.data().avatarUrl || userDoc.data().logoUrl || '',
          phone: userDoc.data().phone || '',
          department: userDoc.data().department || '',
          position: userDoc.data().position || '',
          address: userDoc.data().address || '',
          lastLogin: userDoc.data().lastLogin || '',
          registeredAt: userDoc.data().registeredAt || '',
        };
        setProfile(data);
        setOriginalProfile(data);
        setPreview(data.avatarUrl);
      }
    };
    fetchProfile();
  }, [user, db]);

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
        const storageRef = ref(storage, `admin-avatars/${user.uid}/${image.name}`);
        await uploadBytes(storageRef, image);
        avatarUrl = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(db, 'users', user.uid), {
        name: profile.name,
        avatarUrl,
        phone: profile.phone,
        department: profile.department,
        position: profile.position,
        address: profile.address,
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

  const handleChangePassword = () => {
    // Implementation of handleChangePassword function
  };

  return (
    <AppBackground>
      <>
        <AdminNavbar />
        <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, mt: 10, mb: 4 }}>
          <IconButton onClick={() => navigate('/admin/dashboard')} sx={{ mb: 2, color: '#43e97b', background: 'rgba(67,233,123,0.08)', borderRadius: 2 }}>
            <ArrowBackIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <Box
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 5,
              background: 'linear-gradient(135deg, #181818 0%, #23272f 100%)',
              boxShadow: '0 8px 32px 0 #43e97b44',
              border: '2px solid #43e97b',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4,
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Avatar
                src={preview || profile.avatarUrl}
                alt="Admin Profile Image"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: '4px solid #43e97b',
                  boxShadow: '0 0 24px #43e97b55',
                  bgcolor: 'rgba(67,233,123,0.08)',
                }}
              />
              <Chip label="Admin" color="success" sx={{ fontWeight: 700, mb: 2 }} />
              <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                Last Login: {profile.lastLogin}
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 700 }}>
                Registered: {profile.registeredAt}
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSave} sx={{ flex: 2 }}>
              {success && <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editMode}
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(0,0,0,0.18)',
                    borderRadius: 2,
                    color: '#fff',
                    fontWeight: 700,
                    input: { color: '#fff !important', fontWeight: 700 },
                    '& .MuiInputBase-input.Mui-disabled': { color: '#fff !important' },
                    'input::placeholder': { color: 'rgba(255,255,255,0.85)', opacity: 1, fontWeight: 700 },
                    ':-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px rgba(0,0,0,0.18) inset',
                      WebkitTextFillColor: '#fff !important',
                    },
                  },
                }}
                InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                value={profile.email}
                disabled
                sx={{
                  input: { color: '#fff !important' },
                  '& .Mui-disabled': { color: '#fff !important' },
                }}
                InputLabelProps={{ style: { color: '#43e97b' } }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editMode}
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(0,0,0,0.18)',
                    borderRadius: 2,
                    color: '#fff',
                    fontWeight: 700,
                    input: { color: '#fff !important', fontWeight: 700 },
                    '& .MuiInputBase-input.Mui-disabled': { color: '#fff !important' },
                    'input::placeholder': { color: 'rgba(255,255,255,0.85)', opacity: 1, fontWeight: 700 },
                    ':-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px rgba(236, 231, 231, 0.18) inset',
                      WebkitTextFillColor: '#fff !important',
                    },
                  },
                }}
                InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
              />
              <FormControl fullWidth margin="normal" disabled={!editMode}>
                <InputLabel sx={{ color: '#fff', fontWeight: 700 }}>Department</InputLabel>
                <Select
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  label="Department"
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.18)',
                    borderRadius: 2,
                    color: '#fff',
                    fontWeight: 700,
                    '.MuiSvgIcon-root': { color: '#fff' },
                    '& .MuiSelect-select': { color: '#fff !important', fontWeight: 700 },
                  }}
                  inputProps={{ sx: { color: '#fff !important' } }}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept} sx={{ color: '#fff', fontWeight: 700 }}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                fullWidth
                label="Position"
                name="position"
                value={profile.position}
                onChange={handleChange}
                disabled={!editMode}
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(229, 223, 223, 0.05)',
                    borderRadius: 2,
                    color: '#fff',
                    fontWeight: 700,
                    input: { color: '#fff !important', fontWeight: 700 },
                    '& .MuiInputBase-input.Mui-disabled': { color: '#fff !important' },
                    'input::placeholder': { color: 'rgba(255,255,255,0.85)', opacity: 1, fontWeight: 700 },
                    ':-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px rgba(0,0,0,0.18) inset',
                      WebkitTextFillColor: '#fff !important',
                    },
                  },
                }}
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
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(0,0,0,0.18)',
                    borderRadius: 2,
                    color: '#fff',
                    fontWeight: 700,
                    input: { color: '#fff !important', fontWeight: 700 },
                    '& .MuiInputBase-input.Mui-disabled': { color: '#fff !important' },
                    'input::placeholder': { color: 'rgba(255,255,255,0.85)', opacity: 1, fontWeight: 700 },
                    ':-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px rgba(0,0,0,0.18) inset',
                      WebkitTextFillColor: '#fff !important',
                    },
                  },
                }}
                InputLabelProps={{ style: { color: '#fff', fontWeight: 700 } }}
              />
              {editMode ? (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
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
                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleCancel}
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
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
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
              )}
              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  color: '#43e97b',
                  borderColor: '#43e97b',
                  fontWeight: 700,
                  '&:hover': { background: 'rgba(67,233,123,0.08)', borderColor: '#38f9d7', color: '#38f9d7' },
                }}
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        </Container>
      </>
    </AppBackground>
  );
};

export default AdminProfile; 