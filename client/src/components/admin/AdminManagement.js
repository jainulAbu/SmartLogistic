import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminManagement() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [users, setUsers] = React.useState([]);
  const [pendingDocuments, setPendingDocuments] = React.useState([]);
  const [reportedUsers, setReportedUsers] = React.useState([]);
  const [analytics, setAnalytics] = React.useState({
    revenue: [
      { date: '2024-01', amount: 0 },
      { date: '2024-02', amount: 0 },
      { date: '2024-03', amount: 0 },
      { date: '2024-04', amount: 0 },
      { date: '2024-05', amount: 0 },
      { date: '2024-06', amount: 0 }
    ],
    distance: [
      { date: '2024-01', distance: 0 },
      { date: '2024-02', distance: 0 },
      { date: '2024-03', distance: 0 },
      { date: '2024-04', distance: 0 },
      { date: '2024-05', distance: 0 },
      { date: '2024-06', distance: 0 }
    ],
    totalRevenue: 0,
    totalDistance: 0,
  });
  const [notificationDialog, setNotificationDialog] = React.useState(false);
  const [detailsDialog, setDetailsDialog] = React.useState(false);
  const [selectedDetails, setSelectedDetails] = React.useState(null);
  const [notification, setNotification] = React.useState({
    title: '',
    message: '',
    type: 'all',
  });

  const db = getFirestore();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

      // Fetch pending documents
      const documentsSnapshot = await getDocs(collection(db, 'documents'));
      const documentsData = documentsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.status === 'pending');
      setPendingDocuments(documentsData);

      // Fetch reported users
      const reportedSnapshot = await getDocs(collection(db, 'reports'));
      const reportedData = reportedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReportedUsers(reportedData);

      // Fetch analytics data
      const analyticsSnapshot = await getDocs(collection(db, 'analytics'));
      const analyticsData = analyticsSnapshot.docs.map(doc => doc.data());
      
      // Process analytics data with default values
      const revenueData = analyticsData.length > 0 
        ? analyticsData.map(data => ({
            date: data.date || new Date().toISOString().slice(0, 7),
            amount: data.revenue || 0
          }))
        : analytics.revenue;
      
      const distanceData = analyticsData.length > 0
        ? analyticsData.map(data => ({
            date: data.date || new Date().toISOString().slice(0, 7),
            distance: data.distance || 0
          }))
        : analytics.distance;

      setAnalytics({
        revenue: revenueData,
        distance: distanceData,
        totalRevenue: revenueData.reduce((sum, item) => sum + (item.amount || 0), 0),
        totalDistance: distanceData.reduce((sum, item) => sum + (item.distance || 0), 0),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDocumentApproval = async (docId, status) => {
    try {
      await updateDoc(doc(db, 'documents', docId), { status });
      fetchData();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleSendNotification = async () => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        timestamp: new Date(),
        status: 'sent'
      });
      setNotificationDialog(false);
      setNotification({ title: '', message: '', type: 'all' });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedDetails(user);
    setDetailsDialog(true);
  };

  const handleViewReport = (report) => {
    setSelectedDetails(report);
    setDetailsDialog(true);
  };

  const tableCellStyle = {
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.95)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const tableHeaderStyle = {
    color: '#43e97b',
    fontWeight: 700,
    background: 'rgba(0, 0, 0, 0.95)',
    borderBottom: '2px solid #43e97b'
  };

  const renderUsersTab = () => (
    <TableContainer component={Paper} sx={{ background: 'rgba(0, 0, 0, 0.95)' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={tableHeaderStyle}>Name</TableCell>
            <TableCell sx={tableHeaderStyle}>Email</TableCell>
            <TableCell sx={tableHeaderStyle}>Role</TableCell>
            <TableCell sx={tableHeaderStyle}>Status</TableCell>
            <TableCell sx={tableHeaderStyle}>Documents</TableCell>
            <TableCell sx={tableHeaderStyle}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell sx={tableCellStyle}>{user.name}</TableCell>
              <TableCell sx={tableCellStyle}>{user.email}</TableCell>
              <TableCell sx={tableCellStyle}>{user.role}</TableCell>
              <TableCell sx={tableCellStyle}>
                <Chip
                  label={user.status}
                  color={user.status === 'active' ? 'success' : 'default'}
                  size="small"
                  sx={{ color: '#fff' }}
                />
              </TableCell>
              <TableCell sx={tableCellStyle}>
                <Chip
                  label={user.documentsVerified ? 'Verified' : 'Pending'}
                  color={user.documentsVerified ? 'success' : 'warning'}
                  size="small"
                  sx={{ color: '#fff' }}
                />
              </TableCell>
              <TableCell sx={tableCellStyle}>
                <IconButton onClick={() => handleViewDetails(user)} sx={{ color: '#43e97b' }}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderDocumentsTab = () => (
    <TableContainer component={Paper} sx={{ background: 'rgba(0, 0, 0, 0.95)' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={tableHeaderStyle}>User</TableCell>
            <TableCell sx={tableHeaderStyle}>Document Type</TableCell>
            <TableCell sx={tableHeaderStyle}>Status</TableCell>
            <TableCell sx={tableHeaderStyle}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingDocuments.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell sx={tableCellStyle}>{doc.userName}</TableCell>
              <TableCell sx={tableCellStyle}>{doc.type}</TableCell>
              <TableCell sx={tableCellStyle}>
                <Chip
                  label={doc.status}
                  color="warning"
                  size="small"
                  sx={{ color: '#fff' }}
                />
              </TableCell>
              <TableCell sx={tableCellStyle}>
                <IconButton
                  color="success"
                  onClick={() => handleDocumentApproval(doc.id, 'approved')}
                  sx={{ color: '#43e97b' }}
                >
                  <ApproveIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDocumentApproval(doc.id, 'rejected')}
                  sx={{ color: '#ff4444' }}
                >
                  <RejectIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Revenue Analytics
            </Typography>
            <Typography variant="h4" color="primary">
              ${analytics.totalRevenue.toFixed(2)}
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    name="Revenue"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Distance Analytics
            </Typography>
            <Typography variant="h4" color="primary">
              {analytics.totalDistance.toFixed(2)} km
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.distance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}km`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}km`, 'Distance']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="distance" 
                    stroke="#82ca9d" 
                    name="Distance"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderReportedUsersTab = () => (
    <TableContainer component={Paper} sx={{ background: 'rgba(0, 0, 0, 0.95)' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={tableHeaderStyle}>Reported User</TableCell>
            <TableCell sx={tableHeaderStyle}>Reported By</TableCell>
            <TableCell sx={tableHeaderStyle}>Reason</TableCell>
            <TableCell sx={tableHeaderStyle}>Status</TableCell>
            <TableCell sx={tableHeaderStyle}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportedUsers.map((report) => (
            <TableRow key={report.id}>
              <TableCell sx={tableCellStyle}>{report.reportedUserName}</TableCell>
              <TableCell sx={tableCellStyle}>{report.reportedBy}</TableCell>
              <TableCell sx={tableCellStyle}>{report.reason}</TableCell>
              <TableCell sx={tableCellStyle}>
                <Chip
                  label={report.status}
                  color={report.status === 'resolved' ? 'success' : 'error'}
                  size="small"
                  sx={{ color: '#fff' }}
                />
              </TableCell>
              <TableCell sx={tableCellStyle}>
                <IconButton onClick={() => handleViewReport(report)} sx={{ color: '#43e97b' }}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>Admin Management</Typography>
        <Button
          variant="contained"
          startIcon={<NotificationIcon />}
          onClick={() => setNotificationDialog(true)}
          sx={{
            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
            }
          }}
        >
          Send Notification
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: '#fff',
              '&.Mui-selected': {
                color: '#43e97b'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#43e97b'
            }
          }}
        >
          <Tab label="Users" />
          <Tab label="Documents" />
          <Tab label="Analytics" />
          <Tab label="Reported Users" />
        </Tabs>
      </Box>

      {selectedTab === 0 && renderUsersTab()}
      {selectedTab === 1 && renderDocumentsTab()}
      {selectedTab === 2 && renderAnalyticsTab()}
      {selectedTab === 3 && renderReportedUsersTab()}

      {/* Details Dialog */}
      <Dialog 
        open={detailsDialog} 
        onClose={() => {
          setDetailsDialog(false);
          setSelectedDetails(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedDetails?.role ? 'User Details' : 'Report Details'}
        </DialogTitle>
        <DialogContent>
          {selectedDetails && (
            <Box sx={{ mt: 2 }}>
              {Object.entries(selectedDetails).map(([key, value]) => (
                <Typography key={key} sx={{ mb: 1 }}>
                  <strong>{key}:</strong> {value?.toString()}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDetailsDialog(false);
            setSelectedDetails(null);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={notificationDialog} onClose={() => setNotificationDialog(false)}>
        <DialogTitle>Send Push Notification</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={notification.title}
            onChange={(e) => setNotification({ ...notification, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            value={notification.message}
            onChange={(e) => setNotification({ ...notification, message: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Send To</InputLabel>
            <Select
              value={notification.type}
              onChange={(e) => setNotification({ ...notification, type: e.target.value })}
              label="Send To"
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="drivers">Drivers Only</MenuItem>
              <MenuItem value="vendors">Vendors Only</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialog(false)}>Cancel</Button>
          <Button onClick={handleSendNotification} variant="contained" color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminManagement; 