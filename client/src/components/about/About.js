import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Avatar,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Create a theme instance for the Timeline component
const timelineTheme = createTheme({
  components: {
    MuiTimeline: {
      styleOverrides: {
        root: {
          padding: '0',
        },
      },
    },
    MuiTimelineItem: {
      styleOverrides: {
        root: {
          minHeight: 'auto',
          '&:before': {
            flex: 0,
            padding: 0,
          },
        },
      },
    },
  },
});

const About = () => {
  return (
    <Box sx={{ bgcolor: '#111', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
            About Our Logistics Platform
          </Typography>
          <Typography variant="h5" sx={{ color: '#aaa' }} paragraph>
            Revolutionizing the way goods are transported and delivered
          </Typography>
        </Box>

        {/* Statistics Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#222' }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#43e97b', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff' }}>
                10K+
              </Typography>
              <Typography variant="h6" sx={{ color: '#aaa' }}>Active Users</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#222' }}>
              <LocalShippingIcon sx={{ fontSize: 40, color: '#43e97b', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff' }}>
                50K+
              </Typography>
              <Typography variant="h6" sx={{ color: '#aaa' }}>Deliveries</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#222' }}>
              <LocationOnIcon sx={{ fontSize: 40, color: '#43e97b', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff' }}>
                15+
              </Typography>
              <Typography variant="h6" sx={{ color: '#aaa' }}>Cities Covered</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#222' }}>
              <StarIcon sx={{ fontSize: 40, color: '#43e97b', mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff' }}>
                4.8
              </Typography>
              <Typography variant="h6" sx={{ color: '#aaa' }}>User Rating</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Mission Statement */}
        <Paper elevation={3} sx={{ p: 4, mb: 8, borderRadius: 2, bgcolor: '#222' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#fff' }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ color: '#aaa' }} paragraph>
            We are dedicated to creating a seamless logistics ecosystem that connects vendors, drivers, and customers. 
            Our platform streamlines the entire process of goods transportation, making it more efficient, 
            transparent, and reliable for everyone involved.
          </Typography>
        </Paper>

        {/* Key Features */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#fff' }}>
          Why Choose Us
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#222' }}>
              <CardContent>
                <LocalShippingIcon sx={{ fontSize: 40, color: '#43e97b', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
                  Comprehensive Logistics Solutions
                </Typography>
                <Typography variant="body1" sx={{ color: '#aaa' }}>
                  From small packages to large shipments, we handle all types of cargo with care and efficiency.
                  Our platform connects you with reliable drivers and ensures your goods reach their destination safely.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#222' }}>
              <CardContent>
                <SecurityIcon sx={{ fontSize: 40, color: '#43e97b', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
                  Secure & Reliable
                </Typography>
                <Typography variant="body1" sx={{ color: '#aaa' }}>
                  Your security is our priority. We implement advanced security measures to protect your data
                  and ensure safe transactions throughout the logistics process.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#222' }}>
              <CardContent>
                <SpeedIcon sx={{ fontSize: 40, color: '#43e97b', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
                  Real-time Tracking
                </Typography>
                <Typography variant="body1" sx={{ color: '#aaa' }}>
                  Stay informed with our advanced tracking system. Monitor your shipments in real-time
                  and receive instant updates on delivery status.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#222' }}>
              <CardContent>
                <SupportIcon sx={{ fontSize: 40, color: '#43e97b', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
                  24/7 Support
                </Typography>
                <Typography variant="body1" sx={{ color: '#aaa' }}>
                  Our dedicated support team is available round the clock to assist you with any queries
                  or concerns. We're here to ensure your logistics experience is smooth and hassle-free.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Timeline Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#fff' }}>
          Our Journey
        </Typography>
        <ThemeProvider theme={timelineTheme}>
          <Timeline position="alternate" sx={{ mb: 8 }}>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: '#43e97b' }}>
                  <EmojiEventsIcon />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: '#43e97b' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#222' }}>
                  <Typography variant="h6" sx={{ color: '#fff' }}>2020</Typography>
                  <Typography sx={{ color: '#fff' }}>Platform Launch</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    Started with basic logistics services in 3 major cities
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: '#43e97b' }}>
                  <PeopleIcon />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: '#43e97b' }} />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#222' }}>
                  <Typography variant="h6" sx={{ color: '#fff' }}>2021</Typography>
                  <Typography sx={{ color: '#fff' }}>Expansion Phase</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    Expanded to 10 cities and reached 5,000 active users
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: '#43e97b' }}>
                  <StarIcon />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#222' }}>
                  <Typography variant="h6" sx={{ color: '#fff' }}>2022</Typography>
                  <Typography sx={{ color: '#fff' }}>Current Success</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa' }}>
                    Operating in 15+ cities with over 10,000 active users
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </ThemeProvider>

        {/* Testimonials Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#fff' }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#222' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#43e97b', mr: 2 }}>JD</Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff' }}>John Doe</Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>Vendor</Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: '#aaa' }}>
                  "The platform has revolutionized how we handle our logistics. The real-time tracking feature is a game-changer!"
                </Typography>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} sx={{ color: '#43e97b' }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#222' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#43e97b', mr: 2 }}>AS</Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff' }}>Alice Smith</Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>Driver</Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: '#aaa' }}>
                  "As a driver, I love the flexibility and the steady stream of delivery opportunities. The app is very user-friendly!"
                </Typography>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} sx={{ color: '#43e97b' }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: '#222' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#43e97b', mr: 2 }}>RJ</Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff' }}>Robert Johnson</Typography>
                    <Typography variant="body2" sx={{ color: '#aaa' }}>Vendor</Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: '#aaa' }}>
                  "The route optimization feature has helped us save on fuel costs and improve delivery times significantly."
                </Typography>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} sx={{ color: '#43e97b' }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#fff' }}>
          Our Team
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#222' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random/400x300?business"
                alt="Team Member"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                  John Smith
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  CEO & Founder
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#222' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random/400x300?technology"
                alt="Team Member"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                  Sarah Johnson
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Operations Director
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#222' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://source.unsplash.com/random/400x300?logistics"
                alt="Team Member"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                  Michael Chen
                </Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Technology Lead
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About; 