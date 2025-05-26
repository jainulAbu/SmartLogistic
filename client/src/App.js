import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import VendorDashboard from './components/vendor/VendorDashboard';
import DriverDashboard from './components/driver/DriverDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminRegister from './components/admin/AdminRegister';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import LoadFinding from './components/load/LoadFinding';
import Chat from './components/chat/Chat';
import BookingSummary from './components/booking/BookingSummary';
import VehicleList from './components/vehicles/VehicleList';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminManagement from './components/admin/AdminManagement';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminProfile from './components/admin/AdminProfile';
import TotalDrivers from './components/admin/TotalDrivers';
import CompletedDeliveries from './components/admin/CompletedDeliveries';
import AdminActiveDeliveries from './components/admin/ActiveDeliveries';
import TotalVendors from './components/admin/TotalVendors';
import DriverProfile from './components/driver/DriverProfile';
import VendorShipments from './components/vendor/VendorShipments';
import VendorPayments from './components/vendor/VendorPayments';
import VendorReports from './components/vendor/VendorReports';
import VendorProfile from './components/vendor/VendorProfile';
import VendorActiveDeliveries from './components/vendor/ActiveDeliveries';
import PendingDeliveries from './components/vendor/PendingDeliveries';
import Support from './components/vendor/Support';
import VendorSupport from './components/vendor/VendorSupport';
import VendorGoods from './components/vendor/VendorGoods';
import VendorSettings from './components/vendor/VendorSettings';
import AvailableLoads from './components/driver/AvailableLoads';
import MyDeliveries from './components/driver/MyDeliveries';
import DriverSupport from './components/driver/DriverSupport';
import DriverSettings from './components/driver/DriverSettings';
import Features from './pages/Features';
import Solution from './pages/Solution';
import Career from './pages/Career';
import Resources from './pages/Resources';
import Signup from './pages/Signup';
import DriverNavbar from './components/layout/DriverNavbar';
import VendorCompletedDeliveries from './components/vendor/CompletedDeliveries';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Routes with Navbar */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            <Route path="/solution" element={
              <>
                <Navbar />
                <Solution />
              </>
            } />
            <Route path="/resources" element={
              <>
                <Navbar />
                <Resources />
              </>
            } />
            <Route path="/career" element={
              <>
                <Navbar />
                <Career />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <About />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <Contact />
              </>
            } />
            <Route path="/login" element={
              <>
                <Navbar />
                <Login />
              </>
            } />
            <Route path="/login/vendor" element={
              <>
                <Navbar />
                <Login role="vendor" />
              </>
            } />
            <Route path="/login/driver" element={
              <>
                <Navbar />
                <Login role="driver" />
              </>
            } />
            <Route path="/admin/login" element={
              <>
                <Navbar />
                <AdminLogin />
              </>
            } />
            <Route path="/signup" element={
              <>
                <Navbar />
                <Signup />
              </>
            } />
            <Route path="/register/*" element={
              <>
                <Navbar />
                <Register />
              </>
            } />

            {/* Routes without Navbar */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/total-drivers" element={<TotalDrivers />} />
            <Route path="/admin/total-vendors" element={<TotalVendors />} />
            <Route path="/admin/active-delivery" element={<AdminActiveDeliveries />} />
            <Route path="/admin/complete-delivery" element={<CompletedDeliveries />} />
            <Route path="/profile" element={<Profile />} />

            {/* Protected Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor-dashboard/*"
              element={
                <ProtectedRoute role="vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/*"
              element={
                <ProtectedRoute role="driver">
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['vendor', 'driver', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/load-finding"
              element={
                <ProtectedRoute allowedRoles={['vendor']}>
                  <LoadFinding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={['vendor', 'driver']}>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute allowedRoles={['vendor', 'driver']}>
                  <BookingSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles"
              element={
                <ProtectedRoute allowedRoles={['vendor']}>
                  <VehicleList />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/drivers"
              element={
                <AdminRoute>
                  <TotalDrivers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <AdminRoute>
                  <TotalVendors />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/active-deliveries"
              element={
                <AdminRoute>
                  <AdminActiveDeliveries />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/completed-deliveries"
              element={
                <AdminRoute>
                  <CompletedDeliveries />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <AdminRoute>
                  <AdminProfile />
                </AdminRoute>
              }
            />

            {/* New Admin Management Route */}
            <Route
              path="/admin/management"
              element={
                <ProtectedRoute role="admin">
                  <AdminManagement />
                </ProtectedRoute>
              }
            />

            {/* Admin Analytics Route */}
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute role="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Driver Dashboard Profile Route */}
            <Route
              path="/driver-dashboard/profile"
              element={
                <ProtectedRoute role="driver">
                  <DriverProfile />
                </ProtectedRoute>
              }
            />

            {/* Driver Dashboard Subpages */}
            <Route
              path="/driver-dashboard/available-loads"
              element={
                <ProtectedRoute role="driver">
                  <AvailableLoads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/my-deliveries"
              element={
                <ProtectedRoute role="driver">
                  <MyDeliveries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/support"
              element={
                <ProtectedRoute role="driver">
                  <DriverSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/settings"
              element={
                <ProtectedRoute role="driver">
                  <DriverSettings />
                </ProtectedRoute>
              }
            />

            {/* Vendor Dashboard Routes */}
            <Route path="/vendor-dashboard/shipments" element={<VendorShipments />} />
            <Route path="/vendor-dashboard/payments" element={<VendorPayments />} />
            <Route path="/vendor-dashboard/reports" element={<VendorReports />} />
            <Route path="/vendor-dashboard/profile" element={<VendorProfile />} />
            <Route path="/vendor-dashboard/active-deliveries" element={<VendorActiveDeliveries />} />
            <Route path="/vendor-dashboard/pending-deliveries" element={<PendingDeliveries />} />
            <Route path="/vendor-dashboard/completed-deliveries" element={<VendorCompletedDeliveries />} />
            <Route path="/vendor-dashboard/support" element={<Support />} />
            <Route path="/vendor/profile" element={<VendorProfile />} />
            <Route path="/vendor/support" element={<VendorSupport />} />
            <Route path="/vendor-dashboard/goods" element={<VendorGoods />} />
            <Route path="/vendor-dashboard/settings" element={<VendorSettings />} />

            {/* Driver Routes */}
            <Route
              path="/driver-dashboard"
              element={
                <ProtectedRoute role="driver">
                  <>
                    <DriverNavbar />
                    <DriverDashboard />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/my-deliveries"
              element={
                <ProtectedRoute role="driver">
                  <>
                    <DriverNavbar />
                    <MyDeliveries />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/available-loads"
              element={
                <ProtectedRoute role="driver">
                  <>
                    <DriverNavbar />
                    <AvailableLoads />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/support"
              element={
                <ProtectedRoute role="driver">
                  <>
                    <DriverNavbar />
                    <DriverSupport />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/settings"
              element={
                <ProtectedRoute role="driver">
                  <>
                    <DriverNavbar />
                    <DriverSettings />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard/profile"
              element={
                <ProtectedRoute role="driver">
                  <>
                    <DriverNavbar />
                    <DriverProfile />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
