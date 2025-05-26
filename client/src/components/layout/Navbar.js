import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GreenLogo from '../layout/download (1).png';

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // New navigation order
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Solution', path: '/solution' },
    { name: 'Resources', path: '/resources' },
    { name: 'Career', path: '/career' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: scrolled ? 'rgba(17, 17, 17, 0.95)' : '#111',
        color: '#fff', 
        boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.3)' : 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease-in-out',
        backdropFilter: 'blur(10px)',
        zIndex: 1300,
        transform: scrolled ? 'translateY(0)' : 'translateY(0)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img src={GreenLogo} alt="Smart Logistics Logo" style={{ height: 36, marginRight: 8 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                color: '#fff',
                letterSpacing: 2,
                textDecoration: 'none',
              }}
            >
              Smart Logistics
            </Typography>
          </Box>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
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
                  bgcolor: '#222',
                  color: '#fff',
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              <MenuItem 
                onClick={handleCloseNavMenu}
                component={RouterLink}
                to="/signup"
                sx={{
                  py: 1.5,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                <Typography textAlign="center" fontWeight={600}>Sign Up</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              flexGrow: 1,
              textDecoration: 'none',
            }}
          >
            <img src={GreenLogo} alt="Smart Logistics Logo" style={{ height: 32, marginRight: 6 }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 700,
                color: '#fff',
                letterSpacing: 2,
                textDecoration: 'none',
              }}
            >
              Smart Logistics
            </Typography>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  color: '#fff',
                  display: 'block', 
                  mx: 1,
                  fontSize: '0.95rem', 
                  fontWeight: 500,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: 0,
                    left: '50%',
                    background: 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Sign Up Button */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              sx={{ 
                bgcolor: '#fff',
                color: '#111',
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none', 
                '&:hover': {
                  bgcolor: '#f0f0f0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 