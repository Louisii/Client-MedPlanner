import { Navigate, Outlet } from "react-router-dom";
import { useAuth, validateExpiredToken } from "../lib/AuthProvider";

export const ProtectedRoute = ({ allowedRoles }) => {
    const { token } = useAuth();
    const userRole = sessionStorage.getItem('role');

    if (!token) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/" />;
    }

    if (!validateExpiredToken(token)) {
        // If token is expired, redirect to the login page
        return <Navigate to="/" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // If user role is not allowed, redirect to the home page or an unauthorized page
        return <Navigate to="/home" />;
    }

    return <Outlet />;
};
