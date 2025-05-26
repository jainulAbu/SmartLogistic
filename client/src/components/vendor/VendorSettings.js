import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  TextField,
  IconButton,
} from '@mui/material';
import VendorNavbar from '../layout/VendorNavbar';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const VendorSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    twoFactorAuth: false,
    language: 'en',
    currency: 'USD',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSettingChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked,
    });
  };

  const handlePasswordChange = (field) => (event) => {
    setPassword({
      ...password,
      [field]: event.target.value,
    });
  };

  const handleSaveSettings = async () => {
    try {
      // API call to save settings
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      setError('New passwords do not match');
      return;
    }
    try {
      // API call to change password
      setSuccess('Password changed successfully');
      setPassword({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError('Failed to change password');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
      color: '#fff',
      py: 4
    }}>
      <VendorNavbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
        <Paper sx={{
          p: 3,
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
          borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }
            }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: '#fff',
                  fontWeight: 700,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    textShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
                  }
                }}
              >
            Settings
          </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    color: '#fff',
                    transform: 'translateX(10px)'
                  }
                }}
              >
                Manage your account settings and preferences
              </Typography>
            </Paper>
          </Grid>

          {/* Alerts */}
          {error && (
            <Grid item xs={12}>
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
            </Grid>
          )}
          {success && (
            <Grid item xs={12}>
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
            </Grid>
          )}

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }
            }}>
              <Box display="flex" alignItems="center" mb={3}>
                <NotificationsIcon sx={{ 
                  fontSize: 30, 
                  mr: 2, 
                  color: '#4caf50',
                  transition: 'all 0.3s ease-in-out'
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      color: '#4caf50',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Notification Settings
          </Typography>
              </Box>
              <Divider sx={{ 
                mb: 3, 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: '#4caf50'
                }
              }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
          <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={handleSettingChange('emailNotifications')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4caf50',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#4caf50',
                            },
                          },
                        }}
                      />
                    }
            label="Email Notifications"
                    sx={{
                      color: '#fff',
                      '& .MuiFormControlLabel-label': {
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          color: '#4caf50',
                          transform: 'translateX(5px)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
          <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={handleSettingChange('smsNotifications')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4caf50',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#4caf50',
                            },
                          },
                        }}
                      />
                    }
            label="SMS Notifications"
                    sx={{
                      color: '#fff',
                      '& .MuiFormControlLabel-label': {
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          color: '#4caf50',
                          transform: 'translateX(5px)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={handleSettingChange('pushNotifications')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4caf50',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#4caf50',
                            },
                          },
                        }}
                      />
                    }
                    label="Push Notifications"
                    sx={{
                      color: '#fff',
                      '& .MuiFormControlLabel-label': {
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          color: '#4caf50',
                          transform: 'translateX(5px)'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              background: 'rgba(17, 17, 17, 0.95)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }
            }}>
              <Box display="flex" alignItems="center" mb={3}>
                <SecurityIcon sx={{ 
                  fontSize: 30, 
                  mr: 2, 
                  color: '#4caf50',
                  transition: 'all 0.3s ease-in-out'
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      color: '#4caf50',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Security Settings
          </Typography>
              </Box>
              <Divider sx={{ 
                mb: 3, 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: '#4caf50'
                }
              }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={handleSettingChange('twoFactorAuth')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4caf50',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#4caf50',
                            },
                          },
                        }}
                      />
                    }
                    label="Two-Factor Authentication"
                    sx={{
                      color: '#fff',
                      '& .MuiFormControlLabel-label': {
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          color: '#4caf50',
                          transform: 'translateX(5px)'
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
                    type={showPassword.current ? 'text' : 'password'}
                    value={password.current}
                    onChange={handlePasswordChange('current')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: '#4caf50'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4caf50'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#4caf50'
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
                    type={showPassword.new ? 'text' : 'password'}
                    value={password.new}
                    onChange={handlePasswordChange('new')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: '#4caf50'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4caf50'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#4caf50'
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm New Password"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={password.confirm}
                    onChange={handlePasswordChange('confirm')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: '#4caf50'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4caf50'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#4caf50'
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleChangePassword}
                    startIcon={<SaveIcon />}
                    sx={{
                      background: '#4caf50',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: '#45a049',
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                        '& .MuiSvgIcon-root': {
                          transform: 'rotate(15deg)'
                        }
                      },
                      '& .MuiSvgIcon-root': {
                        transition: 'all 0.3s ease-in-out'
                      }
                    }}
                  >
                    Change Password
            </Button>
                </Grid>
              </Grid>
        </Paper>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                startIcon={<SaveIcon />}
                sx={{
                  background: '#4caf50',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: '#45a049',
                    transform: 'translateY(-5px) scale(1.05)',
                    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
                    '& .MuiSvgIcon-root': {
                      transform: 'rotate(15deg)'
                    }
                  },
                  '& .MuiSvgIcon-root': {
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VendorSettings; 