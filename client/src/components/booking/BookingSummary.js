import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Rating,
  TextField,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  RateReview as ReviewIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const BookingSummary = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userId = auth.currentUser.uid;
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('vendorId', '==', userId)
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const booking = { id: doc.id, ...doc.data() };
          // Fetch vehicle details
          const vehicleDoc = await getDocs(doc(db, 'vehicles', booking.vehicleId));
          booking.vehicle = vehicleDoc.data();
          // Fetch driver details if available
          if (booking.driverId) {
            const driverDoc = await getDocs(doc(db, 'users', booking.driverId));
            booking.driver = driverDoc.data();
          }
          return booking;
        })
      );
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'cancelled',
        cancelledAt: new Date(),
      });
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const reviewData = {
        bookingId: selectedBooking.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date(),
        reviewerId: auth.currentUser.uid,
        reviewerName: auth.currentUser.displayName,
      };
      await addDoc(collection(db, 'reviews'), reviewData);
      setOpenReviewDialog(false);
      fetchBookings();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'inProgress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusSteps = (status) => {
    const steps = ['Booking Confirmed', 'Vehicle Assigned', 'In Transit', 'Completed'];
    const currentStep = {
      pending: 0,
      confirmed: 1,
      inProgress: 2,
      completed: 3,
      cancelled: -1,
    }[status] || 0;
    return { steps, currentStep };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Booking Summary</Typography>
          </Paper>
        </Grid>

        {/* Bookings List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <List>
              {bookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TruckIcon />
                          <Typography variant="subtitle1">
                            {booking.vehicle?.type} - {booking.vehicle?.model}
                          </Typography>
                          <Chip
                            label={booking.status}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationIcon fontSize="small" />
                            <Typography variant="body2">
                              From: {booking.from} → To: {booking.to}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TimeIcon fontSize="small" />
                            <Typography variant="body2">
                              Date: {new Date(booking.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          {booking.driver && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon fontSize="small" />
                              <Typography variant="body2">
                                Driver: {booking.driver.name}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setOpenDialog(true);
                        }}
                      >
                        View Details
                      </Button>
                      {booking.status === 'completed' && !booking.reviewed && (
                        <Button
                          variant="contained"
                          startIcon={<ReviewIcon />}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setOpenReviewDialog(true);
                          }}
                        >
                          Review
                        </Button>
                      )}
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Booking Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stepper activeStep={getStatusSteps(selectedBooking.status).currentStep}>
                    {getStatusSteps(selectedBooking.status).steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Vehicle Details
                      </Typography>
                      <Typography variant="body2">
                        Type: {selectedBooking.vehicle?.type}
                      </Typography>
                      <Typography variant="body2">
                        Model: {selectedBooking.vehicle?.model}
                      </Typography>
                      <Typography variant="body2">
                        Registration: {selectedBooking.vehicle?.registrationNumber}
                      </Typography>
                      <Typography variant="body2">
                        Capacity: {selectedBooking.vehicle?.capacity} tons
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Trip Details
                      </Typography>
                      <Typography variant="body2">
                        From: {selectedBooking.from}
                      </Typography>
                      <Typography variant="body2">
                        To: {selectedBooking.to}
                      </Typography>
                      <Typography variant="body2">
                        Date: {new Date(selectedBooking.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Status: {selectedBooking.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {selectedBooking.driver && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Driver Details
                        </Typography>
                        <Typography variant="body2">
                          Name: {selectedBooking.driver.name}
                        </Typography>
                        <Typography variant="body2">
                          Phone: {selectedBooking.driver.phone}
                        </Typography>
                        <Typography variant="body2">
                          License: {selectedBooking.driver.license}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)}>
        <DialogTitle>Rate Your Experience</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={review.rating}
              onChange={(event, newValue) => {
                setReview({ ...review, rating: newValue });
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comments"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={!review.rating}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingSummary; 