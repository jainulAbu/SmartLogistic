import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  LocalShipping,
  Support,
  Settings,
  Logout,
  DirectionsCar,
  Assignment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DriverNavbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate('/driver-login', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const pages = [
    { name: 'Dashboard', path: '/driver-dashboard', icon: <Dashboard /> },
    { name: 'My Deliveries', path: '/driver-dashboard/my-deliveries', icon: <LocalShipping /> },
    { name: 'Available Loads', path: '/driver-dashboard/available-loads', icon: <DirectionsCar /> },
    { name: 'Support', path: '/driver-dashboard/support', icon: <Support /> },
    { name: 'Settings', path: '/driver-dashboard/settings', icon: <Settings /> },
  ];

  const settings = [
    { name: 'Profile', path: '/driver-dashboard/profile', icon: <AccountCircle /> },
    { name: 'Settings', path: '/driver-dashboard/settings', icon: <Settings /> },
    { name: 'Logout', action: handleLogout, icon: <Logout /> },
  ];

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/driver-dashboard"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                color: '#43e97b',
                textShadow: '0 0 10px rgba(67,233,123,0.5)'
              }
            }}
          >
            DRIVER PORTAL
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#fff' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  background: 'rgba(17, 17, 17, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff'
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                  sx={{ 
                    color: '#fff',
                    '&:hover': {
                      background: 'rgba(67,233,123,0.1)',
                      color: '#43e97b'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {page.icon}
                    <Typography textAlign="center">{page.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile screens */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/driver-dashboard"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                color: '#43e97b',
                textShadow: '0 0 10px rgba(67,233,123,0.5)'
              }
            }}
          >
            DRIVER PORTAL
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(page.path)}
                sx={{
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'rgba(67,233,123,0.1)',
                    color: '#43e97b',
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                {page.icon}
                {page.name}
              </Button>
            ))}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt={currentUser?.displayName || 'Driver'} 
                  src={currentUser?.photoURL}
                  sx={{ 
                    bgcolor: '#43e97b',
                    border: '2px solid rgba(67,233,123,0.3)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      borderColor: '#43e97b',
                      boxShadow: '0 0 10px rgba(67,233,123,0.5)'
                    }
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  background: 'rgba(17, 17, 17, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  minWidth: '180px'
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting.name} 
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting.action) {
                      setting.action();
                    } else if (setting.path) {
                      navigate(setting.path);
                    }
                  }}
                  sx={{ 
                    color: '#fff',
                    py: 1.5,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      background: 'rgba(67,233,123,0.1)',
                      color: '#43e97b',
                      '& .MuiSvgIcon-root': {
                        color: '#43e97b',
                        transform: 'scale(1.1)'
                      }
                    },
                    '& .MuiSvgIcon-root': {
                      transition: 'all 0.3s ease-in-out',
                      color: '#fff'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {setting.icon}
                    <Typography textAlign="center" sx={{ fontWeight: 500 }}>
                      {setting.name}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DriverNavbar; 