import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute; 