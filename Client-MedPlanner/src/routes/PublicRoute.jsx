import { Navigate, Outlet } from "react-router-dom";
import { validateExpiredToken } from "../lib/AuthProvider";

export const PublicRoute = () => {
    const token = localStorage.getItem("token");
    
    if (token && validateExpiredToken(token)) {
      // If not authenticated, redirect to the login page
      return <Navigate to="/home" />;
    }

    return <Outlet />;
  
  };