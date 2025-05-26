import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import AppBackground from '../../components/layout/AppBackground';

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

const sectionTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  color: '#43e97b',
  mb: 3,
  fontWeight: 700,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
};

const Settings = () => {
  const [settings, setSettings] = useState({
    email: '',
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      deliveryUpdates: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { currentUser } = useAuth();
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    if (currentUser) {
      fetchSettings();
    }
  }, [currentUser]);

  const fetchSettings = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setSettings({
          email: currentUser.email,
          notifications: data.notifications || settings.notifications,
          security: data.security || settings.security,
        });
      }
    } catch (err) {
      setError('Failed to load settings');
    }
  };

  const handleNotificationChange = (setting) => (event) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [setting]: event.target.checked,
      },
    });
  };

  const handleSecurityChange = (setting) => (event) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [setting]: event.target.checked,
      },
    });
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        notifications: settings.notifications,
        security: settings.security,
      });
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.newPassword);
      setSuccess('Password updated successfully!');
      setChangePasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)', py: 4 }}>
        <Container maxWidth="md">
          <Paper sx={glassCardStyle}>
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Typography variant="h4" sx={sectionTitleStyle}>
              <AccountCircleIcon /> Account Settings
            </Typography>
            <TextField
              fullWidth
              label="Email"
              value={settings.email}
              disabled
              sx={{ mb: 3 }}
              InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff' } }}
              InputLabelProps={{ style: { color: '#fff' } }}
            />
            <Button
              variant="outlined"
              onClick={() => setChangePasswordDialog(true)}
              sx={{
                color: '#43e97b',
                borderColor: '#43e97b',
                '&:hover': {
                  borderColor: '#38f9d7',
                  bgcolor: 'rgba(67,233,123,0.08)',
                },
              }}
            >
              Change Password
            </Button>

            <Divider sx={{ my: 4, borderColor: 'rgba(67,233,123,0.2)' }} />

            <Typography variant="h4" sx={sectionTitleStyle}>
              <NotificationsIcon /> Notification Preferences
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onChange={handleNotificationChange('emailNotifications')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#43e97b',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#43e97b',
                          },
                        },
                      }}
                    />
                  }
                  label="Email Notifications"
                  sx={{ color: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onChange={handleNotificationChange('pushNotifications')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#43e97b',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#43e97b',
                          },
                        },
                      }}
                    />
                  }
                  label="Push Notifications"
                  sx={{ color: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.deliveryUpdates}
                      onChange={handleNotificationChange('deliveryUpdates')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#43e97b',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#43e97b',
                          },
                        },
                      }}
                    />
                  }
                  label="Delivery Updates"
                  sx={{ color: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.marketingEmails}
                      onChange={handleNotificationChange('marketingEmails')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#43e97b',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#43e97b',
                          },
                        },
                      }}
                    />
                  }
                  label="Marketing Emails"
                  sx={{ color: '#fff' }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: 'rgba(67,233,123,0.2)' }} />

            <Typography variant="h4" sx={sectionTitleStyle}>
              <SecurityIcon /> Security Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onChange={handleSecurityChange('twoFactorAuth')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#43e97b',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#43e97b',
                          },
                        },
                      }}
                    />
                  }
                  label="Two-Factor Authentication"
                  sx={{ color: '#fff' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.loginAlerts}
                      onChange={handleSecurityChange('loginAlerts')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#43e97b',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#43e97b',
                          },
                        },
                      }}
                    />
                  }
                  label="Login Alerts"
                  sx={{ color: '#fff' }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : <SaveIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
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
                Save Changes
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Dialog
        open={changePasswordDialog}
        onClose={() => setChangePasswordDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 17, 17, 0.95)',
            color: '#fff',
            border: '1px solid rgba(67,233,123,0.15)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#43e97b' }}>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff' } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff' } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            InputProps={{ sx: { bgcolor: 'rgba(0,0,0,0.18)', borderRadius: 2, color: '#fff' } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setChangePasswordDialog(false)}
            sx={{ color: '#fff' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            disabled={loading}
            sx={{
              color: '#43e97b',
              '&:hover': {
                bgcolor: 'rgba(67,233,123,0.08)',
              },
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </AppBackground>
  );
};

export default Settings; 