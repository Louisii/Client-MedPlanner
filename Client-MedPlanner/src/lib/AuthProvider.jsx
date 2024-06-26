import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const validateExpiredToken = (token) => {
  try {
    let decodedToken = jwtDecode(token);
    let currentDate = new Date();

    // JWT exp is in seconds
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      console.log("Token expired.");
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("Erro ao validar token em AuthProvider: " + error);
  }
}

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(sessionStorage.getItem("token"));

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if(token && validateExpiredToken(token)){
      // axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      sessionStorage.setItem('token',token);
    } else {
      // delete axios.defaults.headers.common["Authorization"];
      sessionStorage.removeItem('token')
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;