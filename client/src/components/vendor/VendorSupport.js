import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Support as SupportIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';
import AppBackground from '../layout/AppBackground';
import VendorNavbar from '../layout/VendorNavbar';

const VendorSupport = () => {
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm);
    setContactForm({ subject: '', message: '' });
  };

  const faqs = [
    {
      question: 'How do I track my deliveries?',
      answer: 'You can track your deliveries in real-time through the Active Deliveries section of your dashboard. Each delivery card shows the current status and location of your shipment.'
    },
    {
      question: 'What happens if a delivery is delayed?',
      answer: 'If a delivery is delayed, you will be notified through the system. You can contact the driver directly through the chat feature or reach out to our support team for assistance.'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'You can update your profile information by going to the Profile section in your dashboard. Click the "Edit Profile" button to make changes to your details.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit cards, bank transfers, and digital wallets. You can manage your payment preferences in the Settings section.'
    },
    {
      question: 'How do I report an issue with a delivery?',
      answer: 'You can report issues through the Support section of your dashboard. Select the relevant delivery and provide details about the issue. Our support team will assist you promptly.'
    }
  ];

  return (
    <AppBackground>
      <VendorNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Contact Form Section */}
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
              },
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SupportIcon sx={{ 
                  color: '#4caf50', 
                  mr: 1, 
                  fontSize: 28,
                  transition: 'all 0.3s ease-in-out'
                }} />
                <Typography 
                  variant="h4" 
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
                  Contact Support
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
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required
                  sx={{ 
                    mb: 2,
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
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
                  sx={{ 
                    mb: 3,
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
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
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
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* FAQ Section */}
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
              },
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <QuestionAnswerIcon sx={{ 
                  color: '#4caf50', 
                  mr: 1, 
                  fontSize: 28,
                  transition: 'all 0.3s ease-in-out'
                }} />
                <Typography 
                  variant="h4" 
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
                  Frequently Asked Questions
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
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#4caf50' }} />}
                    sx={{
                      '&:hover': {
                        background: 'rgba(76, 175, 80, 0.08)',
                      },
                    }}
                  >
                    <Typography sx={{ 
                      color: '#fff', 
                      fontWeight: 500,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        color: '#4caf50'
                      }
                    }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        color: '#fff'
                      }
                    }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppBackground>
  );
};

export default VendorSupport; 