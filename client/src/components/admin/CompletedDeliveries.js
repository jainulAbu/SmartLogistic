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
  LocalShipping as TruckIcon,
  FileDownload as FileDownloadIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { getFirestore, collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import AppBackground from '../layout/AppBackground';
import AdminNavbar from '../layout/AdminNavbar';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'from', label: 'From' },
  { id: 'to', label: 'To' },
  { id: 'driverName', label: 'Driver' },
  { id: 'vendorName', label: 'Vendor' },
  { id: 'completedAt', label: 'Completion Date' },
  { id: 'status', label: 'Status' },
];

const glassCardStyle = {
  p: 3,
  borderRadius: 4,
  background: 'rgba(17, 17, 17, 0.95)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(67,233,123,0.15)',
  color: '#fff',
  transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
  '&:hover': {
    boxShadow: '0 8px 32px 0 rgba(67,233,123,0.25)',
    borderColor: '#43e97b',
    transform: 'translateY(-2px) scale(1.01)',
  },
};

const CompletedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sortBy, setSortBy] = useState('id');
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
    const deliveriesQuery = query(collection(db, 'deliveries'), where('status', '==', 'completed'));
    const unsubscribe = onSnapshot(deliveriesQuery, (snapshot) => {
      const deliveriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDeliveries(deliveriesData);
    });
    return () => unsubscribe();
  }, [db]);

  // Filtering
  let filteredDeliveries = deliveries.filter(delivery =>
    (delivery.id?.toLowerCase().includes(search.toLowerCase()) ||
      delivery.from?.toLowerCase().includes(search.toLowerCase()) ||
      delivery.to?.toLowerCase().includes(search.toLowerCase()) ||
      delivery.driverName?.toLowerCase().includes(search.toLowerCase()) ||
      delivery.vendorName?.toLowerCase().includes(search.toLowerCase())) &&
    (!dateRange.from || dayjs(delivery.completedAt?.toDate ? delivery.completedAt.toDate() : delivery.completedAt).isAfter(dayjs(dateRange.from).subtract(1, 'day')))
    && (!dateRange.to || dayjs(delivery.completedAt?.toDate ? delivery.completedAt.toDate() : delivery.completedAt).isBefore(dayjs(dateRange.to).add(1, 'day')))
  );

  // Sorting
  filteredDeliveries = filteredDeliveries.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'completedAt') {
      valA = valA?.toDate ? valA.toDate() : valA;
      valB = valB?.toDate ? valB.toDate() : valB;
    }
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const paginatedDeliveries = filteredDeliveries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Bulk selection
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(filteredDeliveries.map((n) => n.id));
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
    const csv = Papa.unparse(filteredDeliveries.map(({ id, ...rest }) => rest));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'completed_deliveries.csv');
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    for (const id of selected) {
      await deleteDoc(doc(db, 'deliveries', id));
    }
    setSelected([]);
  };

  // Status update
  const handleStatusUpdate = async (id, newStatus) => {
    await updateDoc(doc(db, 'deliveries', id), { status: newStatus });
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

  // Summary stats
  const total = deliveries.length;
  const completed = deliveries.filter(d => d.status === 'completed').length;
  const cancelled = deliveries.filter(d => d.status === 'cancelled').length;
  const earnings = deliveries.reduce((sum, d) => sum + (parseFloat(d.amount || 0)), 0);

  return (
    <AppBackground>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <IconButton onClick={() => navigate('/admin/dashboard')} sx={{ mb: 2, color: '#43e97b', background: 'rgba(67,233,123,0.08)', borderRadius: 2 }}>
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <Box sx={glassCardStyle}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 2, gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>Completed Deliveries</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', fontWeight: 700 }} startIcon={<FileDownloadIcon />} onClick={handleExportCSV}>Export CSV</Button>
              <Button variant="contained" color="error" disabled={selected.length === 0} onClick={handleBulkDelete}>Delete Selected</Button>
            </Box>
          </Box>
          {/* Summary Chips */}
          <Box mb={3} display="flex" gap={2} flexWrap="wrap">
            <Chip label={`Total: ${total}`} color="primary" />
            <Chip label={`Completed: ${completed}`} color="success" />
            <Chip label={`Cancelled: ${cancelled}`} color="error" />
            <Chip label={`Earnings: $${earnings}`} color="info" />
          </Box>
          {/* Search and Filters */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              label="Search deliveries"
              variant="outlined"
              size="small"
              sx={{ background: 'rgba(34,34,34,0.8)', borderRadius: 2, minWidth: 200, input: { color: '#fff' } }}
              InputLabelProps={{ style: { color: '#43e97b' } }}
              InputProps={{ style: { color: '#fff' } }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <TextField
              label="From date"
              type="date"
              size="small"
              sx={{ background: 'rgba(34,34,34,0.8)', borderRadius: 2, input: { color: '#fff' } }}
              InputLabelProps={{ shrink: true, style: { color: '#43e97b' } }}
              InputProps={{ style: { color: '#fff' } }}
              value={dateRange.from}
              onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            />
            <TextField
              label="To date"
              type="date"
              size="small"
              sx={{ background: 'rgba(34,34,34,0.8)', borderRadius: 2, input: { color: '#fff' } }}
              InputLabelProps={{ shrink: true, style: { color: '#43e97b' } }}
              InputProps={{ style: { color: '#fff' } }}
              value={dateRange.to}
              onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </Box>
          {/* Table */}
          <Paper sx={{ width: '100%', overflow: 'auto', background: 'rgba(0, 0, 0, 0.95)' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={tableHeaderStyle}>
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < filteredDeliveries.length}
                      checked={filteredDeliveries.length > 0 && selected.length === filteredDeliveries.length}
                      onChange={handleSelectAllClick}
                      sx={{ color: '#43e97b' }}
                    />
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>#</TableCell>
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
                {paginatedDeliveries.map((delivery, idx) => (
                  <TableRow key={delivery.id} selected={isSelected(delivery.id)}>
                    <TableCell padding="checkbox" sx={tableCellStyle}>
                      <Checkbox
                        color="primary"
                        checked={isSelected(delivery.id)}
                        onChange={event => handleClick(event, delivery.id)}
                        sx={{ color: '#43e97b' }}
                      />
                    </TableCell>
                    <TableCell sx={tableCellStyle}>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell sx={tableCellStyle}>{delivery.id}</TableCell>
                    <TableCell sx={tableCellStyle}>{delivery.from}</TableCell>
                    <TableCell sx={tableCellStyle}>{delivery.to}</TableCell>
                    <TableCell sx={tableCellStyle}>{delivery.driverName}</TableCell>
                    <TableCell sx={tableCellStyle}>{delivery.vendorName}</TableCell>
                    <TableCell sx={tableCellStyle}>{delivery.completedAt ? dayjs(delivery.completedAt?.toDate ? delivery.completedAt.toDate() : delivery.completedAt).format('YYYY-MM-DD HH:mm') : 'N/A'}</TableCell>
                    <TableCell sx={tableCellStyle}>
                      {statusEditId === delivery.id ? (
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={() => { setStatusEditId(null); setAnchorEl(null); }}
                        >
                          <MenuItem onClick={() => handleStatusUpdate(delivery.id, 'completed')}>Completed</MenuItem>
                          <MenuItem onClick={() => handleStatusUpdate(delivery.id, 'cancelled')}>Cancelled</MenuItem>
                        </Menu>
                      ) : (
                        <Chip
                          icon={<CheckCircleIcon fontSize="small" />}
                          label={delivery.status}
                          color={'success'}
                          size="small"
                          sx={{ color: '#fff', cursor: 'pointer' }}
                          onClick={e => { setStatusEditId(delivery.id); setAnchorEl(e.currentTarget); }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={tableCellStyle}>
                      <Tooltip title="View Details">
                        <IconButton size="small" sx={{ color: '#43e97b' }} onClick={() => setSelectedDelivery(delivery)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Status">
                        <IconButton size="small" sx={{ color: '#43e97b' }} onClick={e => { setStatusEditId(delivery.id); setAnchorEl(e.currentTarget); }}>
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
                      <Tooltip title="Delete Delivery">
                        <IconButton size="small" sx={{ color: '#dc004e' }} onClick={() => { setSelectedDelivery(delivery); setDeleteOpen(true); }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredDeliveries.length}
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
        <Dialog open={!!selectedDelivery} onClose={() => setSelectedDelivery(null)}>
          <DialogTitle>Delivery Details</DialogTitle>
          <DialogContent>
            {selectedDelivery && (
              <Box>
                <Typography><TruckIcon fontSize="small" /> <b>ID:</b> {selectedDelivery.id}</Typography>
                <Typography><b>From:</b> {selectedDelivery.from}</Typography>
                <Typography><b>To:</b> {selectedDelivery.to}</Typography>
                <Typography><b>Driver:</b> {selectedDelivery.driverName}</Typography>
                <Typography><b>Vendor:</b> {selectedDelivery.vendorName}</Typography>
                <Typography><b>Completion Date:</b> {selectedDelivery.completedAt ? dayjs(selectedDelivery.completedAt?.toDate ? selectedDelivery.completedAt.toDate() : selectedDelivery.completedAt).format('YYYY-MM-DD HH:mm') : 'N/A'}</Typography>
                <Typography><b>Status:</b> {selectedDelivery.status}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDelivery(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this delivery?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button color="error" onClick={async () => { await deleteDoc(doc(db, 'deliveries', selectedDelivery.id)); setDeleteOpen(false); setSelectedDelivery(null); }}>Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Activity Log Dialog (mocked) */}
        <Dialog open={activityOpen} onClose={() => setActivityOpen(false)}>
          <DialogTitle>Activity Log</DialogTitle>
          <DialogContent>
            <Typography>Recent activity for this delivery (mocked):</Typography>
            <ul>
              <li>Completed - 2 hours ago</li>
              <li>Driver uploaded proof - 1 hour ago</li>
              <li>Vendor confirmed receipt - 30 minutes ago</li>
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

export default CompletedDeliveries; 