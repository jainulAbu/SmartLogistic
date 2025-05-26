import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Checkbox,
  TableSortLabel,
  TablePagination,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  DirectionsCar as CarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  FileDownload as FileDownloadIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { getFirestore, collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import AppBackground from '../layout/AppBackground';
import AdminNavbar from '../layout/AdminNavbar';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'vehicleType', label: 'Vehicle Type' },
  { id: 'status', label: 'Status' },
  { id: 'isOnline', label: 'Online' },
];

const TotalDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [activityOpen, setActivityOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusEditId, setStatusEditId] = useState(null);
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const driversQuery = query(collection(db, 'users'), where('role', '==', 'driver'));
    const unsubscribe = onSnapshot(driversQuery, (snapshot) => {
      const driversData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDrivers(driversData);
    });
    return () => unsubscribe();
  }, [db]);

  // Filtering
  let filteredDrivers = drivers.filter(driver =>
    (driver.name?.toLowerCase().includes(search.toLowerCase()) ||
      driver.email?.toLowerCase().includes(search.toLowerCase()) ||
      driver.phone?.toLowerCase().includes(search.toLowerCase()) ||
      driver.vehicleType?.toLowerCase().includes(search.toLowerCase())) &&
    (!dateRange.from || dayjs(driver.createdAt).isAfter(dayjs(dateRange.from).subtract(1, 'day')))
    && (!dateRange.to || dayjs(driver.createdAt).isBefore(dayjs(dateRange.to).add(1, 'day')))
  );

  // Sorting
  filteredDrivers = filteredDrivers.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const paginatedDrivers = filteredDrivers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Bulk selection
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(filteredDrivers.map((n) => n.id));
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredDrivers.map(({ id, ...rest }) => rest));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'drivers.csv');
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    for (const id of selected) {
      await deleteDoc(doc(db, 'users', id));
    }
    setSelected([]);
  };

  // Status update
  const handleStatusUpdate = async (id, newStatus) => {
    await updateDoc(doc(db, 'users', id), { status: newStatus });
    setStatusEditId(null);
  };

  // Update table styles
  const tableCellStyle = { 
    color: '#4A4A4A', 
    maxWidth: 120, 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    background: 'rgba(255,255,255,0.18)',
    borderBottom: '1px solid rgba(156,146,172,0.18)'
  };

  const tableHeaderStyle = {
    color: '#9C92AC',
    fontWeight: 700,
    background: 'rgba(255,255,255,0.18)',
    borderBottom: '2px solid #9C92AC'
  };

  return (
    <AppBackground>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <IconButton onClick={() => navigate('/admin/dashboard')} sx={{ mb: 2, color: '#9C92AC', background: 'rgba(156,146,172,0.08)', borderRadius: 2 }}>
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <Box sx={{
          p: 4,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.18)',
          boxShadow: '0 8px 32px 0 rgba(156,146,172,0.18)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(156,146,172,0.18)',
          color: '#4A4A4A',
        }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 2, gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Total Drivers</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" color="success" startIcon={<FileDownloadIcon />} onClick={handleExportCSV}>Export CSV</Button>
              <Button variant="contained" color="error" disabled={selected.length === 0} onClick={handleBulkDelete}>Delete Selected</Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              label="Search drivers"
              variant="outlined"
              size="small"
              sx={{ background: 'rgba(34,34,34,0.8)', borderRadius: 2, minWidth: 200 }}
              InputLabelProps={{ style: { color: '#43e97b' } }}
              InputProps={{ style: { color: '#fff' } }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <TextField
              label="From date"
              type="date"
              size="small"
              sx={{ background: 'rgba(34,34,34,0.8)', borderRadius: 2 }}
              InputLabelProps={{ shrink: true, style: { color: '#43e97b' } }}
              InputProps={{ style: { color: '#fff' } }}
              value={dateRange.from}
              onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            />
            <TextField
              label="To date"
              type="date"
              size="small"
              sx={{ background: 'rgba(34,34,34,0.8)', borderRadius: 2 }}
              InputLabelProps={{ shrink: true, style: { color: '#43e97b' } }}
              InputProps={{ style: { color: '#fff' } }}
              value={dateRange.to}
              onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </Box>
          <Paper sx={{ width: '100%', overflow: 'auto', background: '#23272f' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={tableHeaderStyle}>
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < filteredDrivers.length}
                      checked={filteredDrivers.length > 0 && selected.length === filteredDrivers.length}
                      onChange={handleSelectAllClick}
                      sx={{ color: '#43e97b' }}
                    />
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>#</TableCell>
                  <TableCell sx={tableHeaderStyle}>Avatar</TableCell>
                  {columns.map(col => (
                    <TableCell key={col.id} sx={tableHeaderStyle}>
                      <TableSortLabel
                        active={sortBy === col.id}
                        direction={sortBy === col.id ? sortOrder : 'asc'}
                        onClick={() => {
                          setSortBy(col.id);
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                        sx={{ color: '#43e97b' }}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell sx={tableHeaderStyle}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDrivers.map((driver, idx) => (
                  <TableRow key={driver.id} selected={isSelected(driver.id)}>
                    <TableCell padding="checkbox" sx={tableCellStyle}>
                      <Checkbox
                        color="primary"
                        checked={isSelected(driver.id)}
                        onChange={event => handleClick(event, driver.id)}
                        sx={{ color: '#43e97b' }}
                      />
                    </TableCell>
                    <TableCell sx={tableCellStyle}>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell sx={tableCellStyle}>
                      <Avatar src={driver.avatarUrl} alt={driver.name} />
                    </TableCell>
                    <TableCell sx={tableCellStyle}>{driver.name}</TableCell>
                    <TableCell sx={tableCellStyle}>{driver.email}</TableCell>
                    <TableCell sx={tableCellStyle}>{driver.phone}</TableCell>
                    <TableCell sx={tableCellStyle}>{driver.vehicleType}</TableCell>
                    <TableCell sx={tableCellStyle}>
                      <Chip
                        icon={driver.status === 'Active' ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={driver.status || 'Active'}
                        color={driver.status === 'Active' ? 'success' : 'default'}
                        size="small"
                        sx={{ color: '#fff', cursor: 'pointer' }}
                        onClick={e => { setStatusEditId(driver.id); setAnchorEl(e.currentTarget); }}
                      />
                    </TableCell>
                    <TableCell sx={tableCellStyle}>
                      <Chip
                        icon={driver.isOnline ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={driver.isOnline ? 'Online' : 'Offline'}
                        color={driver.isOnline ? 'success' : 'default'}
                        size="small"
                        sx={{ color: '#fff' }}
                      />
                    </TableCell>
                    <TableCell sx={tableCellStyle}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" sx={{ color: '#43e97b' }} onClick={() => setSelectedDriver(driver)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Status">
                          <IconButton size="small" sx={{ color: '#43e97b' }} onClick={e => { setStatusEditId(driver.id); setAnchorEl(e.currentTarget); }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Activity Log">
                          <IconButton size="small" sx={{ color: '#43e97b' }} onClick={() => setActivityOpen(true)}>
                            <HistoryIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send Notification">
                          <IconButton size="small" sx={{ color: '#43e97b' }} onClick={() => setNotificationOpen(true)}>
                            <NotificationsIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Driver">
                          <IconButton size="small" sx={{ color: '#dc004e' }} onClick={() => { setSelectedDriver(driver); setDeleteOpen(true); }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredDrivers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              sx={{ 
                color: '#fff', 
                background: 'rgba(0, 0, 0, 0.95)',
                '.MuiTablePagination-select': { color: '#fff' },
                '.MuiTablePagination-selectIcon': { color: '#fff' },
                '.MuiTablePagination-displayedRows': { color: '#fff' },
                '.MuiTablePagination-actions': { color: '#fff' }
              }}
            />
          </Paper>
        </Box>

        {/* Details Dialog */}
        <Dialog open={!!selectedDriver} onClose={() => setSelectedDriver(null)}>
          <DialogTitle>Driver Details</DialogTitle>
          <DialogContent>
            {selectedDriver && (
              <Box>
                <Avatar src={selectedDriver.avatarUrl} alt={selectedDriver.name} sx={{ width: 80, height: 80, mb: 2 }} />
                <Typography><CarIcon fontSize="small" /> <b>Name:</b> {selectedDriver.name}</Typography>
                <Typography><EmailIcon fontSize="small" /> <b>Email:</b> {selectedDriver.email}</Typography>
                <Typography><PhoneIcon fontSize="small" /> <b>Phone:</b> {selectedDriver.phone}</Typography>
                <Typography><b>Vehicle Type:</b> {selectedDriver.vehicleType}</Typography>
                <Typography><b>Status:</b> {selectedDriver.status || 'Active'}</Typography>
                <Typography><b>Online:</b> {selectedDriver.isOnline ? 'Yes' : 'No'}</Typography>
                <Typography><b>Registered:</b> {selectedDriver.createdAt ? dayjs(selectedDriver.createdAt).format('YYYY-MM-DD HH:mm') : 'N/A'}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDriver(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this driver?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button color="error" onClick={async () => { await deleteDoc(doc(db, 'users', selectedDriver.id)); setDeleteOpen(false); setSelectedDriver(null); }}>Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Activity Log Dialog (mocked) */}
        <Dialog open={activityOpen} onClose={() => setActivityOpen(false)}>
          <DialogTitle>Activity Log</DialogTitle>
          <DialogContent>
            <Typography>Recent activity for this driver (mocked):</Typography>
            <ul>
              <li>Logged in - 2 hours ago</li>
              <li>Completed a delivery - 3 hours ago</li>
              <li>Updated profile - 1 day ago</li>
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActivityOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Send Notification Dialog (mocked) */}
        <Dialog open={notificationOpen} onClose={() => setNotificationOpen(false)}>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogContent>
            <TextField label="Message" fullWidth multiline minRows={3} sx={{ mt: 1 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotificationOpen(false)}>Cancel</Button>
            <Button variant="contained" color="success" onClick={() => setNotificationOpen(false)}>Send</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppBackground>
  );
};

export default TotalDrivers; 