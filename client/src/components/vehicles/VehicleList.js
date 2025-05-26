import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Rating,
  IconButton,
} from '@mui/material';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    location: '',
    capacity: '',
  });
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [filters, vehicles]);

  const fetchVehicles = async () => {
    try {
      const vehiclesCollection = collection(db, 'vehicles');
      const vehiclesSnapshot = await getDocs(vehiclesCollection);
      const vehiclesList = vehiclesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVehicles(vehiclesList);
      setFilteredVehicles(vehiclesList);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = [...vehicles];

    if (filters.type !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === filters.type);
    }

    if (filters.location) {
      filtered = filtered.filter(vehicle =>
        vehicle.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.capacity) {
      filtered = filtered.filter(vehicle =>
        vehicle.capacity.toLowerCase().includes(filters.capacity.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookNow = (vehicleId) => {
    navigate(`/booking/${vehicleId}`);
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading vehicles...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Vehicles
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Vehicle Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="lorry">Lorry</MenuItem>
                <MenuItem value="miniTruck">Mini Truck</MenuItem>
                <MenuItem value="truck">Truck</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter city name"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              value={filters.capacity}
              onChange={handleFilterChange}
              placeholder="Enter capacity (e.g., 10 tons)"
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredVehicles.map((vehicle) => (
          <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={vehicle.image || 'https://via.placeholder.com/300x200?text=Vehicle+Image'}
                alt={vehicle.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {vehicle.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={vehicle.type.toUpperCase()}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={vehicle.status}
                    color={vehicle.status === 'available' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Capacity:</strong> {vehicle.capacity}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Dimensions:</strong> {vehicle.dimensions}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {vehicle.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalShippingIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {vehicle.registrationNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {vehicle.driver.contact}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Driver: {vehicle.driver.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={vehicle.driver.rating}
                      precision={0.5}
                      size="small"
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({vehicle.driver.experience})
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  ₹{vehicle.pricePerKm}/km
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleBookNow(vehicle.id)}
                  disabled={vehicle.status !== 'available'}
                >
                  {vehicle.status === 'available' ? 'Book Now' : 'Not Available'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VehicleList; 