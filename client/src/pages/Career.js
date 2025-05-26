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
  TextField,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const benefits = [
  {
    icon: <TrendingUpIcon />,
    title: 'Growth Opportunities',
    description: 'Clear career paths and opportunities for professional development.',
    color: '#43e97b',
  },
  {
    icon: <SchoolIcon />,
    title: 'Learning & Development',
    description: 'Continuous learning opportunities and skill enhancement programs.',
    color: '#4facfe',
  },
  {
    icon: <AttachMoneyIcon />,
    title: 'Competitive Benefits',
    description: 'Comprehensive benefits package and competitive compensation.',
    color: '#f6d365',
  },
  {
    icon: <GroupIcon />,
    title: 'Inclusive Culture',
    description: 'Diverse and inclusive work environment that values every team member.',
    color: '#fa709a',
  },
];

const jobListings = [
  {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our engineering team to build and scale our logistics platform.',
    requirements: [
      '5+ years of software development experience',
      'Strong knowledge of React and Node.js',
      'Experience with cloud platforms (AWS/GCP)',
      'Excellent problem-solving skills',
    ],
  },
  {
    title: 'Logistics Operations Manager',
    department: 'Operations',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Lead and optimize our logistics operations team.',
    requirements: [
      '7+ years of logistics experience',
      'Strong leadership skills',
      'Experience with supply chain management',
      'Analytical mindset',
    ],
  },
  {
    title: 'Data Scientist',
    department: 'Analytics',
    location: 'Remote',
    type: 'Full-time',
    description: 'Drive data-driven decisions and build predictive models.',
    requirements: [
      '3+ years of data science experience',
      'Strong Python and ML skills',
      'Experience with big data technologies',
      'Excellent communication skills',
    ],
  },
];

const Career = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredJobs = jobListings.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#111', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" align="center" sx={{ color: '#fff', fontWeight: 700, mb: 4 }}>
            Join Our Team
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: '#aaa', mb: 8 }}>
            Be part of the future of logistics
          </Typography>
        </motion.div>

        {/* Benefits Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: '#222',
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Box sx={{ color: benefit.color, mb: 2 }}>{benefit.icon}</Box>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    {benefit.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Job Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: '#222',
              mb: 8,
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', mb: 4 }}>
              Open Positions
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search jobs..."
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
                mb: 4,
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

            <Grid container spacing={4}>
              {filteredJobs.map((job, index) => (
                <Grid item xs={12} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        bgcolor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        mb: 2,
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                              {job.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                              <Chip
                                icon={<BusinessIcon />}
                                label={job.department}
                                size="small"
                                sx={{ bgcolor: '#43e97b', color: '#111' }}
                              />
                              <Chip
                                icon={<LocationOnIcon />}
                                label={job.location}
                                size="small"
                                sx={{ bgcolor: '#4facfe', color: '#111' }}
                              />
                              <Chip
                                icon={<AccessTimeIcon />}
                                label={job.type}
                                size="small"
                                sx={{ bgcolor: '#f6d365', color: '#111' }}
                              />
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: '#43e97b',
                              color: '#111',
                              '&:hover': {
                                bgcolor: '#2ecc71',
                              },
                            }}
                          >
                            Apply Now
                          </Button>
                        </Box>
                        <Typography variant="body1" sx={{ color: '#aaa', mb: 2 }}>
                          {job.description}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                          Requirements:
                        </Typography>
                        <List dense>
                          {job.requirements.map((req, idx) => (
                            <ListItem key={idx} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <WorkIcon sx={{ color: '#43e97b', fontSize: 16 }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={req}
                                sx={{ color: '#aaa' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: '#222',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
              Don't See the Right Role?
            </Typography>
            <Typography variant="body1" sx={{ color: '#aaa', mb: 4 }}>
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#43e97b',
                color: '#111',
                '&:hover': {
                  bgcolor: '#2ecc71',
                },
              }}
            >
              Submit Resume
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Career; 