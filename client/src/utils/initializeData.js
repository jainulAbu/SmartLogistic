import { addSampleVehicles } from './sampleVehicles';

export const initializeDatabase = async () => {
  try {
    await addSampleVehicles();
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase; 