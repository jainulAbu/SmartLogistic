import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
} from '@mui/material';
import {
  Check as CheckIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { getFirestore, collection, query, getDocs, updateDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      
      switch (action) {
        case 'verify':
          await updateDoc(userRef, { verified: true });
          break;
        case 'block':
          await updateDoc(userRef, { blocked: true });
          break;
        case 'unblock':
          await updateDoc(userRef, { blocked: false });
          break;
        default:
          break;
      }

      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        User Management
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={user.blocked ? 'Blocked' : user.verified ? 'Verified' : 'Pending'}
                    color={user.blocked ? 'error' : user.verified ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  {!user.verified && (
                    <Tooltip title="Verify User">
                      <IconButton
                        onClick={() => handleUserAction(user.id, 'verify')}
                        color="success"
                        disabled={loading}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {!user.blocked ? (
                    <Tooltip title="Block User">
                      <IconButton
                        onClick={() => handleUserAction(user.id, 'block')}
                        color="error"
                        disabled={loading}
                      >
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unblock User">
                      <IconButton
                        onClick={() => handleUserAction(user.id, 'unblock')}
                        color="success"
                        disabled={loading}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const ref = doc(db, 'admins', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setProfile(snap.data());
      };
      fetchProfile();
    }
  }, [user, db]);

  const handleEdit = () => {
    setForm(profile);
    setEdit(true);
  };

  const handleSave = async () => {
    await updateDoc(doc(db, 'admins', user.uid), form);
    setProfile(form);
    setEdit(false);
  };

  if (!profile) return <div style={{ color: '#fff' }}>Loading...</div>;

  return (
    <Box>
      <Avatar src={profile.photoURL} sx={{ width: 80, height: 80, mb: 2 }} />
      <Typography variant="h5" sx={{ color: '#fff' }}>{profile.name}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>Email: {profile.email}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>Phone: {profile.phone}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>Role: {profile.role}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Registered: {profile.registeredAt}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Last Login: {profile.lastLogin}</Typography>
      {edit ? (
        <>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} sx={{ input: { color: '#fff' } }} InputLabelProps={{ style: { color: '#43e97b' } }} />
          <TextField label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} sx={{ input: { color: '#fff' } }} InputLabelProps={{ style: { color: '#43e97b' } }} />
          <Button onClick={handleSave} sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', fontWeight: 700, mt: 2 }}>Save</Button>
        </>
      ) : (
        <Button onClick={handleEdit} sx={{ background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', fontWeight: 700, mt: 2 }}>Edit Profile</Button>
      )}
    </Box>
  );
};

export { UserManagement, AdminProfile };
export default UserManagement; 