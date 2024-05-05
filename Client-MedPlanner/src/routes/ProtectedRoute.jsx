import { Navigate, Outlet } from "react-router-dom";
import { useAuth, validateExpiredToken } from "../lib/AuthProvider";

export const ProtectedRoute = () => {
    const { token } = useAuth();

    if (!token) {
      // If not authenticated, redirect to the login page
      return <Navigate to="/" />;
    }

    if(!validateExpiredToken(token)){
      return <Navigate to="/" />;
    }

    return <Outlet />;
  
  };