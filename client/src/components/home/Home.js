import React, { useRef, useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  ListItemButton,
  Link,
  CardMedia,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LocalShipping as TruckIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  LocationOn as LocationOnIcon,
  Payment as PaymentIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Map as MapIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  Verified as VerifiedIcon,
  LocalOffer,
  TrendingUp as TrendingUpIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Business as BusinessIcon,
  Help as HelpIcon,
  ContactSupport as ContactSupportIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Flight as FlightIcon,
  LocalShipping as LocalShippingIcon,
  DirectionsBoat as ShipIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TruckVideo from './Truck.mp4';

// Add keyframes at the top level
const keyframes = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(25, 118, 210, 0.5); }
    50% { box-shadow: 0 0 30px rgba(25, 118, 210, 0.8); }
  }
  @keyframes slideIn {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    0% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(-100%); opacity: 0; }
  }
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  @keyframes wave {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

const featuresList = [
  { icon: <LocationOnIcon />, title: 'Live GPS Tracking', description: 'Track every shipment in real time, anywhere in the world with beautiful map visuals.' },
  { icon: <MapIcon />, title: 'AI Route Planner', description: 'Save time and fuel with smart, animated route optimization.' },
  { icon: <PaymentIcon />, title: 'Instant Payments', description: 'Experience seamless, secure, and instant payment processing.' },
  { icon: <SupportIcon />, title: '24/7 Live Chat', description: 'Get help anytime with our modern, always-on support chat.' },
  { icon: <AnalyticsIcon />, title: 'Analytics Dashboard', description: 'Visualize your logistics data with stunning, interactive dashboards.' },
];

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'For Shippers', href: '#shippers' },
  { label: 'For Drivers', href: '#drivers' },
  { label: 'Contact', href: '#contact' },
];

// Galaxy Background Component
export const GalaxyBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffdab9 0%, #ffb6c1 50%, #ffc0cb 100%)',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'twinkle 4s infinite linear',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
        animation: 'pulse 8s infinite ease-in-out',
      }
    }}
  >
    {[...Array(50)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          background: '#ffffff',
          borderRadius: '50%',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          opacity: Math.random() * 0.3 + 0.2,
          animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`,
        }}
      />
    ))}
  </Box>
);

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [dragDirection, setDragDirection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const slideRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signUpAnchor, setSignUpAnchor] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [featureIndex, setFeatureIndex] = useState(0);
  const featuresRef = useRef(null);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const pageEndRef = useRef(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const testimonials = [
    {
      name: "John Smith",
      role: "Logistics Manager",
      company: "Global Shipping Co.",
      image: "https://source.unsplash.com/random/100x100?portrait=1",
      rating: 5,
      text: "This platform has revolutionized our delivery operations. The real-time tracking and route optimization have saved us countless hours and resources.",
    },
    {
      name: "Sarah Johnson",
      role: "Fleet Owner",
      company: "Swift Transport",
      image: "https://source.unsplash.com/random/100x100?portrait=2",
      rating: 5,
      text: "The driver verification system and smart matching have helped us expand our fleet efficiently. Highly recommended!",
    },
    {
      name: "Michael Chen",
      role: "E-commerce Director",
      company: "QuickMart",
      image: "https://source.unsplash.com/random/100x100?portrait=3",
      rating: 4.5,
      text: "Our delivery times have improved by 40% since we started using this platform. The customer feedback has been outstanding.",
    }
  ];

  const featuredServices = [
    {
      title: "Express Delivery",
      description: "Same-day delivery for urgent shipments with real-time tracking and instant notifications",
      icon: <SpeedIcon />,
      color: "#ffffff",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      stats: {
        deliveryTime: "2-4 hours",
        coverage: "100+ cities",
        satisfaction: "98%"
      },
      features: [
        "Real-time tracking",
        "Instant notifications",
        "Priority handling",
        "Dedicated support"
      ],
      badge: "Most Popular"
    },
    {
      title: "Fleet Management",
      description: "Complete control over your delivery fleet with advanced analytics and route optimization",
      icon: <TruckIcon />,
      color: "#ffffff",
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      stats: {
        vehicles: "1000+",
        routes: "5000+ daily",
        efficiency: "30% better"
      },
      features: [
        "Route optimization",
        "Fuel monitoring",
        "Driver analytics",
        "Maintenance alerts"
      ],
      badge: "Enterprise Ready"
    },
    {
      title: "Smart Routing",
      description: "AI-powered route optimization to reduce fuel costs and delivery time",
      icon: <MapIcon />,
      color: "#ffffff",
      image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      stats: {
        savings: "25% fuel",
        timeSaved: "40%",
        accuracy: "99.9%"
      },
      features: [
        "AI optimization",
        "Traffic prediction",
        "Weather integration",
        "Dynamic rerouting"
      ],
      badge: "AI Powered"
    }
  ];

  // Typewriter words
  const typewriterWords = [
    'Fast',
    'Reliable',
    'Smart',
    'Secure',
    'Efficient',
    'Modern'
  ];

  // Stats data with animation triggers
  const stats = [
    { value: 10000, label: 'Active Users', icon: <PeopleIcon />, color: '#1976d2' },
    { value: 50000, label: 'Deliveries', icon: <TruckIcon />, color: '#ffb300' },
    { value: 4.8, label: 'User Rating', icon: <StarIcon />, color: '#43e97b', suffix: '/5' },
    { value: 15, label: 'Cities Covered', icon: <LocationOnIcon />, color: '#ff5e62', suffix: '+' }
  ];

  // Progress bars data
  const progressData = [
    { label: 'On-time Delivery', value: 98, color: '#1976d2' },
    { label: 'Customer Satisfaction', value: 95, color: '#ffb300' },
    { label: 'Route Optimization', value: 92, color: '#43e97b' },
    { label: 'Driver Satisfaction', value: 94, color: '#ff5e62' }
  ];

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 400);
      if (!pageEndRef.current) return;
      const rect = pageEndRef.current.getBoundingClientRect();
      setShowBottomNav(rect.top <= window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Testimonial auto-sliding
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, testimonials.length]);

  // GSAP animations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.utils.toArray('.animate-section').forEach(section => {
        gsap.from(section, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 15%',
            toggleActions: 'play none none none',
            once: true
          }
        });
      });
    }
  }, []);

  // Event handlers - Keep only one instance of each function here
  const handleSignUpClick = (event) => {
    setSignUpAnchor(event.currentTarget);
  };

  const handleSignUpClose = () => {
    setSignUpAnchor(null);
  };

  const handleSignUpOption = (role) => {
    handleSignUpClose();
    navigate(`/register/${role}`);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSlideChange = (direction) => {
    setIsAutoPlaying(false);
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handleSlideChange('prev');
      } else {
        handleSlideChange('next');
      }
    }
    controls.start({ x: 0 });
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleDrag = (event, info) => {
    x.set(info.offset.x);
  };

  const handleFeatureClick = (index) => {
    setFeatureIndex(index);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleMenuExpand = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const logisticsFeatures = [
    {
      icon: <TimelineIcon />,
      title: 'Real-time Tracking',
      description: 'Track your shipments with GPS precision and get instant updates',
      color: '#1976d2'
    },
    {
      icon: <MapIcon />,
      title: 'Route Optimization',
      description: 'AI-powered route planning to reduce fuel costs and delivery time',
      color: '#ffb300'
    },
    {
      icon: <NotificationsIcon />,
      title: 'Smart Notifications',
      description: 'Get instant alerts for delivery status, delays, and important updates',
      color: '#43e97b'
    },
    {
      icon: <ChatIcon />,
      title: 'In-app Messaging',
      description: 'Direct communication between vendors, drivers, and customers',
      color: '#ff5e62'
    },
    {
      icon: <VerifiedIcon />,
      title: 'Verified Drivers',
      description: 'All drivers are background-checked and verified for your safety',
      color: '#7e57c2'
    },
    {
      icon: <LocalOffer />,
      title: 'Dynamic Pricing',
      description: 'Smart pricing based on distance, demand, and vehicle type',
      color: '#ff7043'
    }
  ];

  const benefits = [
    {
      title: 'For Vendors',
      items: [
        'Easy shipment management',
        'Real-time tracking',
        'Secure payments',
        'Driver verification',
        'Route optimization',
        'Analytics dashboard'
      ]
    },
    {
      title: 'For Drivers',
      items: [
        'Flexible working hours',
        'Competitive earnings',
        'Route optimization',
        'Instant payments',
        'Job matching',
        'Performance rewards'
      ]
    }
  ];

  const menuItems = [
    {
      title: 'Services',
      icon: <TruckIcon />,
      submenu: [
        { title: 'Express Delivery', icon: <SpeedIcon /> },
        { title: 'Fleet Management', icon: <CarIcon /> },
        { title: 'Route Optimization', icon: <MapIcon /> },
      ]
    },
    {
      title: 'Solutions',
      icon: <AnalyticsIcon />,
      submenu: [
        { title: 'For Businesses', icon: <BusinessIcon /> },
        { title: 'For Drivers', icon: <PersonIcon /> },
        { title: 'For Vendors', icon: <VerifiedIcon /> },
      ]
    },
    {
      title: 'Support',
      icon: <SupportIcon />,
      submenu: [
        { title: 'Help Center', icon: <HelpIcon /> },
        { title: 'Contact Us', icon: <ContactSupportIcon /> },
        { title: 'FAQs', icon: <ChatIcon /> },
      ]
    }
  ];

  // Theme toggle handler
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Add shipping features array
  const shippingFeatures = [
    {
      title: "Air Shipping",
      description: "Express air freight services for time-sensitive deliveries worldwide.",
      icon: <FlightIcon />,
      color: "#fff",
      stats: {
        coverage: "200+ Airports",
        speed: "24-48 Hours",
        capacity: "Up to 100 Tons"
      }
    },
    {
      title: "Water Shipping",
      description: "Efficient maritime logistics for bulk cargo and container shipping.",
      icon: <ShipIcon />,
      color: "#fff",
      stats: {
        coverage: "300+ Ports",
        capacity: "20,000+ TEU",
        routes: "Global Network"
      }
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', color: '#ffffff', bgcolor: 'transparent' }}>
      <GalaxyBackground />

      {/* Rest of the content */}
      <Container maxWidth="lg" sx={{ pt: 10 }}>
        {/* Hero Section */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            position: 'relative',
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 10 },
            mb: 4,
            overflow: 'hidden',
          }}
        >
          {/* Video Background */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                zIndex: 1,
              },
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'fixed',
                top: 0,
                left: 0,
              }}
            >
              <source src={TruckVideo} type="video/mp4" />
            </video>
          </Box>

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', md: '3.5rem' },
                color: '#ffffff',
                mb: 3,
                letterSpacing: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Welcome to the Future of Logistics
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#ffffff',
                fontWeight: 400,
                maxWidth: 700,
                mx: 'auto',
                mb: 5,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              Seamless, smart, and secure logistics management for shippers, drivers, and vendors. Connect, track, and optimize your deliveries in real time.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/features')}
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                px: 6,
                py: 2,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #ffffff 0%, #cccccc 100%)',
                color: '#000000',
                boxShadow: '0 2px 12px 0 rgba(255, 255, 255, 0.2)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #cccccc 0%, #ffffff 100%)',
                  boxShadow: '0 4px 20px 0 rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Explore Features
            </Button>
          </Container>
        </Box>

        {/* Enhanced Testimonials Slideshow */}
        <Box sx={{ mb: 8, position: 'relative', overflow: 'hidden' }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            What Our Clients Say
          </Typography>
          <Container maxWidth="md">
            <Box sx={{ position: 'relative', height: 400 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  ref={slideRef}
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={controls}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={handleDragStart}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  style={{ x, opacity }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.9)',
                        boxShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Avatar
                        src={testimonials[currentSlide].image}
                        sx={{ 
                          width: 100, 
                          height: 100, 
                          mb: 3, 
                          border: '3px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                        }}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Box sx={{ mb: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                          >
                            <StarIcon
                              sx={{
                                color: i < Math.floor(testimonials[currentSlide].rating)
                                  ? '#ffb300'
                                  : i < testimonials[currentSlide].rating
                                  ? '#ffb300'
                                  : 'rgba(255, 255, 255, 0.2)',
                                fontSize: 24,
                                mx: 0.5,
                              }}
                            />
                          </motion.span>
                        ))}
                      </Box>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          mb: 2,
                          fontStyle: 'italic',
                          maxWidth: '80%',
                          mx: 'auto',
                        }}
                      >
                        "{testimonials[currentSlide].text}"
                      </Typography>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {testimonials[currentSlide].name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {testimonials[currentSlide].role} at {testimonials[currentSlide].company}
                      </Typography>
                    </motion.div>
                  </Paper>
                </motion.div>
              </AnimatePresence>

              {/* Slide Indicators */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2,
                gap: 1,
              }}>
                {testimonials.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: currentSlide === index ? 1.2 : 0.8,
                      backgroundColor: currentSlide === index ? '#ff8c00' : 'rgba(255, 255, 255, 0.2)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentSlide(index);
                    }}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Featured Services Section */}
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 4,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Featured Services
          </Typography>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {featuredServices.map((service, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.95)', // Darker background
                        backdropFilter: 'blur(10px)',
                        borderRadius: 4,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
                          '& .MuiCardMedia-root': {
                            transform: 'scale(1.1)',
                          },
                          '& .service-icon': {
                            transform: 'scale(1.2) rotate(10deg)',
                          },
                        },
                      }}
                    >
                      {/* Badge */}
                      <Chip
                        label={service.badge}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          zIndex: 1,
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#000',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      />

                      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={service.image}
                          alt={service.title}
                          sx={{
                            height: '100%',
                            transition: 'transform 0.5s ease-in-out',
                            objectFit: 'cover',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
                          }}
                        />
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <motion.div
                            className="service-icon"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {React.cloneElement(service.icon, {
                              sx: { 
                                fontSize: 32, 
                                color: '#ffffff', 
                                mr: 1,
                                transition: 'all 0.3s ease-in-out',
                              }
                            })}
                          </motion.div>
                          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
                            {service.title}
                          </Typography>
                        </Box>

                        <Typography variant="body1" sx={{ color: '#ffffff', mb: 2 }}>
                          {service.description}
                        </Typography>

                        {/* Stats Section */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          mb: 2,
                          p: 1,
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 1,
                        }}>
                          {Object.entries(service.stats).map(([key, value]) => (
                            <Box key={key} sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                                {value}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#ffffff' }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        {/* Features List */}
                        <Box sx={{ mb: 2 }}>
                          {service.features.map((feature, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 16, mr: 1 }} />
                              <Typography variant="body2" sx={{ color: '#ffffff' }}>
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outlined"
                            sx={{
                              color: '#ffffff',
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                              '&:hover': {
                                borderColor: '#ffffff',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            Learn More
                          </Button>
                        </motion.div>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Enhanced Stats Section with Animated Counters */}
        <Box ref={ref} className="animate-section" sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Platform Statistics
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        background: 'rgba(0, 0, 0, 0.9)',
                      },
                    }}
                  >
                    {React.cloneElement(stat.icon, { 
                      sx: { fontSize: 40, color: stat.color, mb: 2 } 
                    })}
                    <Typography variant="h4" sx={{ color: stat.color }}>
                      {inView && (
                        <CountUp
                          end={stat.value}
                          duration={2.5}
                          suffix={stat.suffix || ''}
                        />
                      )}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Add this new section before the "Why Choose Us?" section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Global Logistics Excellence
          </Typography>
          
          <Container maxWidth="lg">
          <Grid container spacing={4}>
              {/* Global Reach */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                <Paper
                  sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease-in-out',
                  }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LocationOnIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                      <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Global Network
                  </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
                      Our extensive logistics network spans across continents, connecting businesses with reliable delivery solutions worldwide.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>150+</Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Countries</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>1000+</Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cities</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>24/7</Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Support</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Technology Innovation */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Paper
                      sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <SpeedIcon sx={{ fontSize: 40, color: '#2196f3', mr: 2 }} />
                      <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Smart Technology
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
                      Leveraging cutting-edge technology to optimize routes, reduce costs, and enhance delivery efficiency.
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CheckCircleIcon sx={{ color: '#2196f3', fontSize: 20, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            AI Route Optimization
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CheckCircleIcon sx={{ color: '#2196f3', fontSize: 20, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            Real-time Tracking
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CheckCircleIcon sx={{ color: '#2196f3', fontSize: 20, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            Smart Analytics
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CheckCircleIcon sx={{ color: '#2196f3', fontSize: 20, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            IoT Integration
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Sustainability */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Paper
                      sx={{
                      p: 4,
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <EmojiEventsIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                      <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Sustainable Logistics
                      </Typography>
                    </Box>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 700, mb: 1 }}>
                            30%
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            Carbon Footprint Reduction
                          </Typography>
                  </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 700, mb: 1 }}>
                            50%
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            Green Fleet Vehicles
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 700, mb: 1 }}>
                            100%
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            Carbon Neutral Operations
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                </Paper>
                </motion.div>
              </Grid>
          </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <SecurityIcon />,
                title: 'Secure Platform',
                description: 'Your data and transactions are protected with advanced security measures',
                color: '#ff8c00'
              },
              {
                icon: <SpeedIcon />,
                title: 'Real-time Tracking',
                description: 'Track your shipments and deliveries in real-time with our advanced tracking system',
                color: '#ff4500'
              },
              {
                icon: <SupportIcon />,
                title: '24/7 Support',
                description: 'Our dedicated support team is available round the clock to assist you',
                color: '#ff4500'
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      {React.cloneElement(feature.icon, { 
                        sx: { fontSize: 48, color: '#ffffff' } 
                      })}
                    </Box>
                    <Typography variant="h5" gutterBottom align="center" sx={{ color: '#ffffff' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ color: '#ffffff' }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* New: Quick Actions Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              { icon: <TruckIcon />, label: 'Track Shipment', color: '#ff8c00' },
              { icon: <CarIcon />, label: 'Find Loads', color: '#ff4500' },
              { icon: <PaymentIcon />, label: 'Make Payment', color: '#ff4500' },
              { icon: <ChatIcon />, label: 'Support Chat', color: '#ff4500' }
            ].map((action, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.9)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    {React.cloneElement(action.icon, { 
                      sx: { fontSize: 40, color: action.color, mb: 1 } 
                    })}
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {action.label}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* New: Benefits Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Platform Benefits
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                      {benefit.title}
                    </Typography>
                    <List>
                      {benefit.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex}>
                          <ListItemIcon>
                            <CheckCircleIcon sx={{ color: '#43e97b' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item} 
                            sx={{ color: '#ffffff' }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* New: Features Grid */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Advanced Features
          </Typography>
          <Grid container spacing={4}>
            {logisticsFeatures.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      {React.cloneElement(feature.icon, { 
                        sx: { fontSize: 48, color: '#ffffff' } 
                      })}
                    </Box>
                    <Typography variant="h5" gutterBottom align="center" sx={{ color: '#ffffff' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ color: '#ffffff' }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Our Features Section - Auto Sliding */}
        <Box sx={{ mb: 8, width: '100%' }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Our Features
          </Typography>
          <Box
            ref={featuresRef}
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              gap: 4,
              px: 2,
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              pb: 2,
              minHeight: 360,
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.4)',
                },
              },
            }}
          >
            {featuresList.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ scrollSnapAlign: 'center', minWidth: 350, maxWidth: 400, height: 320, flex: '0 0 auto' }}
                onClick={() => handleFeatureClick(index)}
              >
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.9)',
                      boxShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.1 }}
                    style={{ display: 'inline-block', marginBottom: 18 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}>{feature.title}</Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>{feature.description}</Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
          {/* Dot indicators */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
            {featuresList.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => handleFeatureClick(idx)}
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: featureIndex === idx ? 'linear-gradient(90deg, #ff8c00 0%, #ff4500 100%)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: featureIndex === idx ? '2.5px solid #fff' : 'none',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Platform Features - Only 3 features */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Platform Features
          </Typography>
          <Grid container spacing={4}>
            {featuresList.slice(0, 3).map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(255,140,0,0.12)' }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.8)',
                      borderRadius: 4,
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 2px 12px 0 rgba(255, 140, 0, 0.04)',
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      {React.cloneElement(feature.icon, { sx: { fontSize: 48, color: '#ffffff' } })}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{feature.title}</Typography>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>{feature.description}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Future Enhancements / Coming Soon Section */}
        <Box sx={{ mb: 8, bgcolor: 'transparent', py: 8 }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: 1.5,
            }}
          >
            Future Enhancements
          </Typography>
          {/* Slideshow Carousel */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 350 }}>
            <IconButton
              onClick={() => setFeatureIndex((prev) => (prev === 0 ? shippingFeatures.length - 1 : prev - 1))}
              sx={{ 
                position: 'absolute', 
                left: 0, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 2, 
                color: '#fff', 
                bgcolor: 'rgba(0,0,0,0.5)', 
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.7)',
                  transform: 'translateY(-50%) scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {'<'}
            </IconButton>
            <motion.div
              key={featureIndex}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{ width: 400, maxWidth: '90vw' }}
            >
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #111 70%, #222 100%)',
                  borderRadius: 4,
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  }
                }}
              >
                <Box sx={{ mb: 3 }}>
                  {React.cloneElement(shippingFeatures[featureIndex].icon, { 
                    sx: { 
                      fontSize: 64, 
                      color: shippingFeatures[featureIndex].color,
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
                    } 
                  })}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#fff', letterSpacing: 1 }}>
                  {shippingFeatures[featureIndex].title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#eee', mb: 3, fontWeight: 500 }}>
                  {shippingFeatures[featureIndex].description}
                </Typography>
                
                {/* Stats Grid */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {Object.entries(shippingFeatures[featureIndex].stats).map(([key, value]) => (
                    <Grid item xs={4} key={key}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 1,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem' }}>
                          {key}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Chip 
                  label="Coming Soon" 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    fontWeight: 700, 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    color: '#fff', 
                    letterSpacing: 1,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }} 
                />
              </Paper>
            </motion.div>
            <IconButton
              onClick={() => setFeatureIndex((prev) => (prev === shippingFeatures.length - 1 ? 0 : prev + 1))}
              sx={{ 
                position: 'absolute', 
                right: 0, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 2, 
                color: '#fff', 
                bgcolor: 'rgba(0,0,0,0.5)', 
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.7)',
                  transform: 'translateY(-50%) scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {'>'}
            </IconButton>
          </Box>
          
          {/* Dot Indicators */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
            {shippingFeatures.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setFeatureIndex(idx)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: featureIndex === idx ? '#fff' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    background: '#fff'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>

      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          py: 6,
          mt: 8,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                  Logistics App
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  Revolutionizing logistics with cutting-edge technology and exceptional service.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton sx={{ color: 'white' }}><FacebookIcon /></IconButton>
                  <IconButton sx={{ color: 'white' }}><TwitterIcon /></IconButton>
                  <IconButton sx={{ color: 'white' }}><LinkedInIcon /></IconButton>
                  <IconButton sx={{ color: 'white' }}><InstagramIcon /></IconButton>
                </Box>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                Quick Links
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemButton component="a" href="#features" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Features
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component="a" href="#workflow" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    How It Works
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component="a" href="#shippers" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    For Shippers
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component="a" href="#drivers" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    For Drivers
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                Contact Us
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="123 Logistics Street"
                    secondary="Business District, City, State 12345"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="+1 (555) 123-4567"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MailIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="support@logisticsapp.com"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          {/* Bottom Footer */}
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              © 2024 Logistics App. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              <Link href="#" sx={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>
                Cookie Policy
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      <div ref={pageEndRef} />
      {/* Bottom Navigation Bar (appears at end of scroll) */}
      {showBottomNav && (
        <Box sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          bgcolor: 'linear-gradient(45deg, #000428 0%, #004e92 100%)',
          boxShadow: '0 -2px 12px 0 rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center',
          py: 2,
        }}>
          {/* You can use your nav links here, styled for the bottom bar */}
          {/* Example: */}
          <Button color="inherit" href="/">Home</Button>
          <Button color="inherit" href="/solution">Solution</Button>
          <Button color="inherit" href="/resources">Resources</Button>
          <Button color="inherit" href="/career">Career</Button>
          <Button color="inherit" href="/about">About Us</Button>
          <Button color="inherit" href="/contact">Contact Us</Button>
          <Button color="inherit" href="/login">Sign In</Button>
          <Button color="inherit" href="/register">Sign Up</Button>
        </Box>
      )}
    </Box>
  );
};

export default Home; 