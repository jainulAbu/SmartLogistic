import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../firebase/config';

const db = getFirestore(app);

const sampleVehicles = [
  // Lorries
  {
    type: 'lorry',
    name: 'Heavy Duty Lorry',
    capacity: '15 tons',
    dimensions: '40ft x 8ft x 8ft',
    registrationNumber: 'LOR-001',
    status: 'available',
    location: 'Mumbai',
    pricePerKm: 25,
    features: ['GPS Tracking', 'Temperature Control', 'Tail Lift'],
    image: 'https://example.com/lorry1.jpg',
    driver: {
      name: 'Rajesh Kumar',
      experience: '8 years',
      rating: 4.5,
      contact: '+91 9876543210'
    }
  },
  {
    type: 'lorry',
    name: 'Multi-Axle Lorry',
    capacity: '20 tons',
    dimensions: '45ft x 8.5ft x 8.5ft',
    registrationNumber: 'LOR-002',
    status: 'available',
    location: 'Delhi',
    pricePerKm: 30,
    features: ['GPS Tracking', 'Air Suspension', 'Anti-lock Brakes'],
    image: 'https://example.com/lorry2.jpg',
    driver: {
      name: 'Suresh Patel',
      experience: '10 years',
      rating: 4.8,
      contact: '+91 9876543211'
    }
  },
  {
    type: 'lorry',
    name: 'Container Lorry',
    capacity: '25 tons',
    dimensions: '50ft x 8ft x 8ft',
    registrationNumber: 'LOR-003',
    status: 'available',
    location: 'Chennai',
    pricePerKm: 35,
    features: ['GPS Tracking', 'Container Lock', 'Fleet Management'],
    image: 'https://example.com/lorry3.jpg',
    driver: {
      name: 'Amit Singh',
      experience: '12 years',
      rating: 4.7,
      contact: '+91 9876543212'
    }
  },

  // Mini Trucks
  {
    type: 'miniTruck',
    name: 'Compact Mini Truck',
    capacity: '1.5 tons',
    dimensions: '12ft x 6ft x 6ft',
    registrationNumber: 'MIN-001',
    status: 'available',
    location: 'Bangalore',
    pricePerKm: 15,
    features: ['GPS Tracking', 'Fuel Efficient', 'Easy Maneuvering'],
    image: 'https://example.com/mini1.jpg',
    driver: {
      name: 'Kiran Desai',
      experience: '5 years',
      rating: 4.3,
      contact: '+91 9876543213'
    }
  },
  {
    type: 'miniTruck',
    name: 'Urban Delivery Mini',
    capacity: '2 tons',
    dimensions: '14ft x 6.5ft x 6.5ft',
    registrationNumber: 'MIN-002',
    status: 'available',
    location: 'Hyderabad',
    pricePerKm: 18,
    features: ['GPS Tracking', 'Low Maintenance', 'City Friendly'],
    image: 'https://example.com/mini2.jpg',
    driver: {
      name: 'Vikram Mehta',
      experience: '6 years',
      rating: 4.4,
      contact: '+91 9876543214'
    }
  },
  {
    type: 'miniTruck',
    name: 'Eco Mini Truck',
    capacity: '1.8 tons',
    dimensions: '13ft x 6ft x 6ft',
    registrationNumber: 'MIN-003',
    status: 'available',
    location: 'Pune',
    pricePerKm: 16,
    features: ['GPS Tracking', 'Eco-Friendly', 'Low Emissions'],
    image: 'https://example.com/mini3.jpg',
    driver: {
      name: 'Rahul Sharma',
      experience: '4 years',
      rating: 4.2,
      contact: '+91 9876543215'
    }
  },

  // Trucks
  {
    type: 'truck',
    name: 'Heavy Hauler',
    capacity: '10 tons',
    dimensions: '30ft x 8ft x 8ft',
    registrationNumber: 'TRK-001',
    status: 'available',
    location: 'Kolkata',
    pricePerKm: 22,
    features: ['GPS Tracking', 'Power Steering', 'Air Brakes'],
    image: 'https://example.com/truck1.jpg',
    driver: {
      name: 'Mohammed Ali',
      experience: '9 years',
      rating: 4.6,
      contact: '+91 9876543216'
    }
  },
  {
    type: 'truck',
    name: 'Refrigerated Truck',
    capacity: '8 tons',
    dimensions: '28ft x 8ft x 8ft',
    registrationNumber: 'TRK-002',
    status: 'available',
    location: 'Ahmedabad',
    pricePerKm: 28,
    features: ['GPS Tracking', 'Temperature Control', 'Insulated Body'],
    image: 'https://example.com/truck2.jpg',
    driver: {
      name: 'Sanjay Gupta',
      experience: '7 years',
      rating: 4.5,
      contact: '+91 9876543217'
    }
  },
  {
    type: 'truck',
    name: 'Flatbed Truck',
    capacity: '12 tons',
    dimensions: '32ft x 8.5ft x 8.5ft',
    registrationNumber: 'TRK-003',
    status: 'available',
    location: 'Jaipur',
    pricePerKm: 24,
    features: ['GPS Tracking', 'Hydraulic Lift', 'Tie-down Points'],
    image: 'https://example.com/truck3.jpg',
    driver: {
      name: 'Deepak Verma',
      experience: '11 years',
      rating: 4.7,
      contact: '+91 9876543218'
    }
  }
];

export const addSampleVehicles = async () => {
  try {
    const vehiclesCollection = collection(db, 'vehicles');
    
    for (const vehicle of sampleVehicles) {
      await addDoc(vehiclesCollection, {
        ...vehicle,
        createdAt: new Date(),
        lastUpdated: new Date(),
        isActive: true,
        currentLocation: {
          latitude: 0,
          longitude: 0
        },
        maintenanceHistory: [],
        bookings: [],
        ratings: [],
        documents: {
          registration: 'valid',
          insurance: 'valid',
          permit: 'valid'
        }
      });
    }
    
    console.log('Sample vehicles added successfully!');
  } catch (error) {
    console.error('Error adding sample vehicles:', error);
  }
};

export default sampleVehicles; 