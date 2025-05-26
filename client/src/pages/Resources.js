import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import BookIcon from '@mui/icons-material/Book';

const resources = {
  articles: [
    {
      title: 'The Future of Logistics Technology',
      description: 'Explore the latest trends and innovations shaping the logistics industry.',
      type: 'Article',
      icon: <ArticleIcon />,
      color: '#43e97b',
    },
    {
      title: 'Optimizing Supply Chain Operations',
      description: 'Learn how to streamline your supply chain for maximum efficiency.',
      type: 'Article',
      icon: <ArticleIcon />,
      color: '#4facfe',
    },
    {
      title: 'Sustainable Logistics Practices',
      description: 'Discover eco-friendly approaches to modern logistics.',
      type: 'Article',
      icon: <ArticleIcon />,
      color: '#f6d365',
    },
  ],
  videos: [
    {
      title: 'Getting Started with Our Platform',
      description: 'A comprehensive guide to using our logistics platform effectively.',
      type: 'Video',
      icon: <VideoLibraryIcon />,
      color: '#fa709a',
    },
    {
      title: 'Advanced Route Optimization',
      description: 'Master the art of route planning and optimization.',
      type: 'Video',
      icon: <VideoLibraryIcon />,
      color: '#43e97b',
    },
  ],
  courses: [
    {
      title: 'Logistics Fundamentals',
      description: 'Essential knowledge for logistics professionals.',
      type: 'Course',
      icon: <SchoolIcon />,
      color: '#4facfe',
    },
    {
      title: 'Supply Chain Management',
      description: 'Comprehensive course on modern supply chain management.',
      type: 'Course',
      icon: <SchoolIcon />,
      color: '#f6d365',
    },
  ],
};

const events = [
  {
    title: 'Logistics Innovation Summit 2024',
    date: 'June 15-17, 2024',
    location: 'Virtual Event',
    icon: <EventIcon />,
  },
  {
    title: 'Supply Chain Excellence Conference',
    date: 'July 22-24, 2024',
    location: 'New York, NY',
    icon: <EventIcon />,
  },
];

const Resources = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredResources = {
    articles: resources.articles.filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    videos: resources.videos.filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    courses: resources.courses.filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  return (
    <Box sx={{ bgcolor: '#111', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" align="center" sx={{ color: '#fff', fontWeight: 700, mb: 4 }}>
            Resources
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: '#aaa', mb: 8 }}>
            Explore our comprehensive collection of logistics resources
          </Typography>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              bgcolor: '#222',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#aaa' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#43e97b',
                  },
                },
              }}
            />
          </Paper>
        </motion.div>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: '#aaa',
                '&.Mui-selected': {
                  color: '#43e97b',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#43e97b',
              },
            }}
          >
            <Tab label="Articles" />
            <Tab label="Videos" />
            <Tab label="Courses" />
          </Tabs>
        </Box>

        {/* Resources Grid */}
        <Grid container spacing={4}>
          {Object.entries(filteredResources).map(([category, items], categoryIndex) => (
            selectedTab === categoryIndex && (
              items.map((resource, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        bgcolor: '#222',
                        height: '100%',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ color: resource.color, mr: 2 }}>{resource.icon}</Box>
                          <Chip
                            label={resource.type}
                            size="small"
                            sx={{
                              bgcolor: resource.color,
                              color: '#111',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                          {resource.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
                          {resource.description}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={resource.type === 'Video' ? <PlayCircleIcon /> : <DownloadIcon />}
                          sx={{
                            color: resource.color,
                            borderColor: resource.color,
                            '&:hover': {
                              borderColor: resource.color,
                              bgcolor: `${resource.color}20`,
                            },
                          }}
                        >
                          {resource.type === 'Video' ? 'Watch' : 'Download'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            )
          ))}
        </Grid>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mt: 8,
              borderRadius: 2,
              bgcolor: '#222',
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', mb: 4 }}>
              Upcoming Events
            </Typography>
            <Grid container spacing={4}>
              {events.map((event, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      bgcolor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ color: '#43e97b', mr: 2 }}>{event.icon}</Box>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          {event.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>
                        {event.date}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        {event.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Resources; 