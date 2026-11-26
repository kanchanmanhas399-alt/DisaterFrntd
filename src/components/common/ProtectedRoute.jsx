import React from 'react';
import { Navigate } from 'react-router-dom';
import { getIsLogin, isAdmin } from '../../services/AuthServices';
import toast from 'react-hot-toast';

export const ProtectedUserRoute = ({ children }) => {
    const loggedIn = getIsLogin();
    if (!loggedIn) {
        toast.error("Please login to access this page", { id: "auth-guard" });
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const ProtectedAdminRoute = ({ children }) => {
    const loggedIn = getIsLogin();
    const admin = isAdmin();

    if (!loggedIn) {
        toast.error("Please login as administrator to access Admin Panel", { id: "admin-guard" });
        return <Navigate to="/login" replace />;
    }

    if (!admin) {
        toast.error("Access denied. Administrator privileges required.", { id: "admin-denied" });
        return <Navigate to="/" replace />;
    }

    return children;
};
