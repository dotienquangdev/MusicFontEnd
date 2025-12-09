import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState("");

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ successMessage, showSuccessMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
