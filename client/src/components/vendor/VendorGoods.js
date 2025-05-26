import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Pagination,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import AppBackground from '../layout/AppBackground';
import VendorNavbar from '../layout/VendorNavbar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const VendorGoods = () => {
  const { currentUser } = useAuth();
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGoods, setNewGoods] = useState({
    name: '',
    type: '',
    weight: '',
    amount: '',
    description: '',
    pickupLocation: '',
    deliveryLocation: '',
    status: 'Draft',
  });
  const [error, setError] = useState('');
  const db = getFirestore();
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editGoods, setEditGoods] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [chatOpen, setChatOpen] = useState(false);
  const [chatGoods, setChatGoods] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatDriverId, setChatDriverId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectDriverOpen, setSelectDriverOpen] = useState(false);
  const [selectedGoodsForDriver, setSelectedGoodsForDriver] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedGoods, setSelectedGoods] = useState(null);
  const [driversMap, setDriversMap] = useState({});
  const [completedNotifications, setCompletedNotifications] = useState([]);

  const fetchGoods = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'goods'), where('vendorId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      setGoods(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError('Failed to fetch goods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoods();
    // eslint-disable-next-line
  }, [currentUser]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setNewGoods({ name: '', type: '', weight: '', amount: '', description: '', pickupLocation: '', deliveryLocation: '', status: 'Draft' });
    setError('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setError('');
  };

  const handleAddGoods = async () => {
    if (!newGoods.name || !newGoods.type || !newGoods.weight || !newGoods.amount || !newGoods.pickupLocation || !newGoods.deliveryLocation) {
      setError('Please fill all required fields');
      return;
    }
    setError('');
    try {
      await addDoc(collection(db, 'goods'), {
        ...newGoods,
        vendorId: currentUser.uid,
        status: 'Available',
        createdAt: serverTimestamp(),
      });
      setDialogOpen(false);
      fetchGoods();
    } catch (err) {
      setError('Failed to add goods. Please try again.');
    }
  };

  const handleMarkAsAvailable = async (goodsId) => {
    try {
      await updateDoc(doc(db, 'goods', goodsId), { status: 'Available' });
      fetchGoods();
    } catch (err) {
      setError('Failed to update goods status.');
    }
  };

  const filteredGoods = goods.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditGoods({ ...item });
  };

  const handleEditChange = (e) => {
    setEditGoods({ ...editGoods, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await updateDoc(doc(db, 'goods', editId), editGoods);
      setEditId(null);
      fetchGoods();
    } catch (err) {
      setError('Failed to update goods.');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Fetch the goods document before deleting for history
      const goodsDoc = await getDocs(query(collection(db, 'goods'), where('__name__', '==', id)));
      let goodsData = null;
      if (!goodsDoc.empty) {
        goodsData = goodsDoc.docs[0].data();
      }
      // Delete the goods document
      await deleteDoc(doc(db, 'goods', id));
      // Add to deletedGoodsHistory for audit
      if (goodsData) {
        await addDoc(collection(db, 'deletedGoodsHistory'), {
          ...goodsData,
          deletedAt: serverTimestamp(),
          deletedBy: currentUser.uid,
          goodsId: id,
        });
        // Notify admin
        await addDoc(collection(db, 'adminNotifications'), {
          type: 'goods_deleted',
          vendorId: currentUser.uid,
          goodsId: id,
          goodsName: goodsData.name,
          deletedAt: serverTimestamp(),
          message: `Vendor deleted goods: ${goodsData.name}`,
        });
      }
      fetchGoods();
    } catch (err) {
      setError('Failed to delete goods.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Type', 'Weight', 'Amount', 'Description', 'Status'];
    const rows = filteredGoods.map(item => [item.name, item.type, item.weight, item.amount, item.description, item.status]);
    let csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'goods_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paginatedGoods = filteredGoods.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleOpenChat = (goods, driverId) => {
    setChatGoods(goods);
    setChatDriverId(driverId);
    setChatOpen(true);
  };

  useEffect(() => {
    if (chatOpen && chatGoods && chatDriverId) {
      const chatDocId = `${chatGoods.id}_${chatDriverId}`;
      const chatRef = doc(db, 'goodsChats', chatDocId);
      const unsub = onSnapshot(chatRef, (docSnap) => {
        if (docSnap.exists()) {
          setChatHistory(docSnap.data().messages || []);
        } else {
          setChatHistory([]);
        }
      });
      return () => unsub();
    }
  }, [chatOpen, chatGoods, chatDriverId, db]);

  const handleSendChat = async () => {
    if (!chatMessage || !chatGoods || !chatDriverId) return;
    const chatDocId = `${chatGoods.id}_${chatDriverId}`;
    const chatRef = doc(db, 'goodsChats', chatDocId);
    const newMsg = {
      sender: 'vendor',
      senderId: currentUser.uid,
      text: chatMessage,
      timestamp: serverTimestamp(),
    };
    let chatDoc = await getDocs(query(collection(db, 'goodsChats'), where('goodsId', '==', chatGoods.id), where('driverId', '==', chatDriverId)));
    if (!chatDoc.empty) {
      // Update existing
      await updateDoc(chatRef, {
        messages: [...chatHistory, { ...newMsg, timestamp: new Date() }],
      });
    } else {
      // Create new
      await setDoc(chatRef, {
        goodsId: chatGoods.id,
        vendorId: currentUser.uid,
        driverId: chatDriverId,
        messages: [{ ...newMsg, timestamp: new Date() }],
      });
    }
    setChatMessage('');
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateDoc(doc(db, 'goods', id), { status });
      fetchGoods();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const fetchDrivers = async () => {
    const q = query(collection(db, 'drivers'));
    const querySnapshot = await getDocs(q);
    setDrivers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Fetch driver info for requested goods
  useEffect(() => {
    const fetchDriversForRequestedGoods = async () => {
      const requestedGoods = goods.filter(g => g.status === 'Requested' && g.driverId);
      const newDriversMap = { ...driversMap };
      for (const g of requestedGoods) {
        if (!newDriversMap[g.driverId]) {
          const driverDoc = await getDocs(query(collection(db, 'drivers'), where('__name__', '==', g.driverId)));
          if (!driverDoc.empty) {
            newDriversMap[g.driverId] = driverDoc.docs[0].data();
          }
        }
      }
      setDriversMap(newDriversMap);
    };
    if (goods.length) fetchDriversForRequestedGoods();
    // eslint-disable-next-line
  }, [goods]);

  const handleApproveRequest = async (item) => {
    await updateDoc(doc(db, 'goods', item.id), { status: 'Assigned' });
    fetchGoods();
  };
  const handleRejectRequest = async (item) => {
    await updateDoc(doc(db, 'goods', item.id), { status: 'Available', driverId: '' });
    fetchGoods();
  };

  // Listen for completed deliveries
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'goods'), where('vendorId', '==', currentUser.uid), where('status', '==', 'Completed'));
    const unsub = onSnapshot(q, (snapshot) => {
      setCompletedNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [currentUser, db]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
      color: '#fff',
      py: 4
    }}>
      <VendorNavbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
              Goods Management
            </Typography>
              <Button
                variant="contained"
                onClick={handleOpenDialog}
              sx={{
                background: '#4caf50',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: '#45a049',
                  transform: 'translateY(-5px) scale(1.05)',
                  boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
                }
              }}
              >
                Add New Goods
              </Button>
            </Box>

          {/* Search and Filter Section */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search goods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4caf50',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4caf50',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
          </Box>

          {/* Goods List */}
          <Box sx={{ mt: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress sx={{ color: '#4caf50' }} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ 
                background: 'rgba(211, 47, 47, 0.1)',
                color: '#ff6b6b',
                border: '1px solid rgba(211, 47, 47, 0.2)'
              }}>
                {error}
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {paginatedGoods.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#181818', color: '#fff', boxShadow: '0 2px 12px #0008', mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                            <Typography sx={{ fontSize: 15, color: '#43e97b', mb: 1 }}>
                              {item.pickupLocation} → {item.deliveryLocation}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }}><b>Type:</b> {item.type}</Typography>
                            <Typography sx={{ fontSize: 14 }}><b>Weight:</b> {item.weight}</Typography>
                            <Typography sx={{ fontSize: 14 }}><b>Description:</b> {item.description}</Typography>
                            <Typography sx={{ fontSize: 14 }}><b>Amount:</b> {item.amount}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                          <Chip label={item.status} color={item.status === 'Available' ? 'success' : item.status === 'Requested' ? 'warning' : 'default'} sx={{ mb: 1 }} />
                          {item.status === 'Completed' && (
                            <Chip icon={<NotificationsActiveIcon sx={{ color: '#43e97b' }} />} label="Delivered" sx={{ background: 'rgba(67,233,123,0.08)', color: '#43e97b', fontWeight: 700, mb: 1 }} />
                          )}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton color="primary" onClick={() => { setSelectedGoods(item); setDetailsDialogOpen(true); }}><VisibilityIcon /></IconButton>
                            <IconButton color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                            {item.driverId && (
                              <IconButton color="primary" onClick={() => handleOpenChat(item, item.driverId)}><ChatIcon /></IconButton>
                            )}
                          </Box>
                          {item.status === 'Available' && (
                            <Button size="small" variant="outlined" color="warning" onClick={() => handleStatusChange(item.id, 'Unavailable')} sx={{ mt: 1 }}>Mark as Unavailable</Button>
                          )}
                          {item.status === 'Requested' && item.driverId && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(67,233,123,0.08)', borderRadius: 2, width: '100%' }}>
                              <Typography variant="subtitle2" sx={{ color: '#43e97b' }}>Requested by:</Typography>
                              <Typography variant="body2" sx={{ color: '#fff' }}>{driversMap[item.driverId]?.name || 'Driver'}</Typography>
                              <Typography variant="body2" sx={{ color: '#fff' }}>{driversMap[item.driverId]?.phone || ''}</Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Button size="small" variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleApproveRequest(item)}>Approve</Button>
                                <Button size="small" variant="outlined" color="error" startIcon={<CloseIcon />} onClick={() => handleRejectRequest(item)}>Reject</Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Pagination */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(filteredGoods.length / itemsPerPage)}
                page={page}
              onChange={(e, value) => setPage(value)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': {
                    background: '#4caf50',
                    color: '#fff',
                    '&:hover': {
                      background: '#45a049',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                },
              }}
              />
            </Box>
        </Paper>
      </Container>

      {/* Add/Edit Goods Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(17, 17, 17, 0.95)',
            color: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>
          {editId ? 'Edit Goods' : 'Add New Goods'}
        </DialogTitle>
          <DialogContent>
          {error && (
            <Alert severity="error" sx={{ 
              background: 'rgba(211, 47, 47, 0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(211, 47, 47, 0.2)',
              mb: 2
            }}>
              {error}
            </Alert>
          )}
            <TextField
              fullWidth
            label="Name"
            value={editId ? editGoods.name : newGoods.name}
            onChange={(e) => editId ? setEditGoods({ ...editGoods, name: e.target.value }) : setNewGoods({ ...newGoods, name: e.target.value })}
              margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#4caf50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
            />
            <TextField
              fullWidth
              label="Type"
            value={editId ? editGoods.type : newGoods.type}
            onChange={(e) => editId ? setEditGoods({ ...editGoods, type: e.target.value }) : setNewGoods({ ...newGoods, type: e.target.value })}
              margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#4caf50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
            />
            <TextField
              fullWidth
              label="Weight (kg)"
            value={editId ? editGoods.weight : newGoods.weight}
            onChange={(e) => editId ? setEditGoods({ ...editGoods, weight: e.target.value }) : setNewGoods({ ...newGoods, weight: e.target.value })}
              margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#4caf50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
            />
            <TextField
              fullWidth
              label="Amount"
            value={editId ? editGoods.amount : newGoods.amount}
            onChange={(e) => editId ? setEditGoods({ ...editGoods, amount: e.target.value }) : setNewGoods({ ...newGoods, amount: e.target.value })}
              margin="normal"
              type="number"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#4caf50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
            <TextField
              fullWidth
              label="Description"
            value={editId ? editGoods.description : newGoods.description}
            onChange={(e) => editId ? setEditGoods({ ...editGoods, description: e.target.value }) : setNewGoods({ ...newGoods, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#4caf50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
            />
            <TextField
              margin="dense"
              label="Pickup Location"
              name="pickupLocation"
              value={editId ? editGoods.pickupLocation : newGoods.pickupLocation}
              onChange={e => editId ? setEditGoods({ ...editGoods, pickupLocation: e.target.value }) : setNewGoods({ ...newGoods, pickupLocation: e.target.value })}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#4caf50' },
                  '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                },
                '& .MuiInputLabel-root': { color: '#fff' },
              }}
            />
              <TextField
              margin="dense"
              label="Drop Location"
              name="deliveryLocation"
              value={editId ? editGoods.deliveryLocation : newGoods.deliveryLocation}
              onChange={e => editId ? setEditGoods({ ...editGoods, deliveryLocation: e.target.value }) : setNewGoods({ ...newGoods, deliveryLocation: e.target.value })}
                fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#4caf50' },
                  '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                },
                '& .MuiInputLabel-root': { color: '#fff' },
              }}
            />
          </DialogContent>
          <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editId ? handleEditSave : handleAddGoods}
            variant="contained"
            sx={{
              background: '#4caf50',
              '&:hover': {
                background: '#45a049',
              },
            }}
          >
            {editId ? 'Save Changes' : 'Add Goods'}
          </Button>
          </DialogActions>
        </Dialog>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(17, 17, 17, 0.95)',
            color: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>
          Chat with Driver
        </DialogTitle>
          <DialogContent>
          <Box sx={{ height: '300px', overflowY: 'auto', mb: 2 }}>
              {chatHistory.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'vendor' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    maxWidth: '70%',
                    background: msg.sender === 'vendor' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleString() : ''}
                </Typography>
                </Paper>
              </Box>
              ))}
            </Box>
            <TextField
              fullWidth
            variant="outlined"
              placeholder="Type your message..."
              value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#4caf50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4caf50',
                },
              },
            }}
          />
          </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setChatOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleSendChat}
            variant="contained"
            sx={{
              background: '#4caf50',
              '&:hover': {
                background: '#45a049',
              },
            }}
          >
            Send
          </Button>
        </DialogActions>
        </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Goods Details</DialogTitle>
        <DialogContent>
          {selectedGoods && (
            <Box>
              <Typography variant="h6">{selectedGoods.name}</Typography>
              <Typography><b>Pickup Location:</b> {selectedGoods.pickupLocation}</Typography>
              <Typography><b>Drop Location:</b> {selectedGoods.deliveryLocation}</Typography>
              <Typography><b>Type:</b> {selectedGoods.type}</Typography>
              <Typography><b>Weight:</b> {selectedGoods.weight}</Typography>
              <Typography><b>Description:</b> {selectedGoods.description}</Typography>
              <Typography><b>Amount:</b> {selectedGoods.amount}</Typography>
              <Typography><b>Status:</b> {selectedGoods.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorGoods; 