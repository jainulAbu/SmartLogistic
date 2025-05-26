# Logistics Management Platform

A comprehensive platform connecting vendors with vehicle owners for efficient transportation services.

## Features

- User Authentication (Vendor, Driver, Admin roles)
- Real-time Load Tracking
- Vehicle Management
- Chat System
- Price Negotiation
- Booking Management
- Admin Dashboard
- Route Optimization

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: Firebase (Firestore)
- Real-time Communication: Socket.IO
- Maps Integration: Google Maps API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google Maps API key

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd logistics-app
   ```

2. **Install Dependencies**
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory:
   ```
   PORT=5000
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

   Create a `.env` file in the client directory:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Firebase Setup**

   a. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Enable Authentication:
      - Go to Authentication > Sign-in method
      - Enable Email/Password authentication
   
   c. Set up Firestore Database:
      - Go to Firestore Database
      - Create database in production mode
      - Set up security rules
   
   d. Set up Storage:
      - Go to Storage
      - Initialize storage
      - Set up security rules

5. **Google Maps Setup**

   a. Go to [Google Cloud Console](https://console.cloud.google.com/)
   
   b. Create a new project or select existing one
   
   c. Enable Maps JavaScript API
   
   d. Create API key and restrict it to your domain

6. **Run the Application**

   ```bash
   # Start the backend server (from root directory)
   npm run server

   # Start the frontend development server (from client directory)
   cd client
   npm start
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Project Structure

```
logistics-app/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # React components
│       ├── contexts/      # React contexts
│       ├── hooks/         # Custom hooks
│       └── utils/         # Utility functions
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   └── routes/           # API routes
└── package.json          # Project dependencies
```

## Available Scripts

- `npm run server`: Start the backend server
- `npm run client`: Start the frontend development server
- `npm run dev`: Start both frontend and backend servers concurrently
- `npm run build`: Build the frontend for production
- `npm start`: Start the production server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@logistics-app.com or create an issue in the repository. 