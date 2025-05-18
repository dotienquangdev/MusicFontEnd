import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);  // Hook để lấy context

export const AuthProvider = ({ children }) => {
    const [successMessage, setSuccessMessage] = useState("");  // Khai báo state successMessage

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);  // Hàm để cập nhật successMessage
        setTimeout(() => {
            setSuccessMessage(""); // Ẩn thông báo sau 3 giây
        }, 2000);
    };

    return (
        <AuthContext.Provider value={{ successMessage, showSuccessMessage }}>
            {children}
        </AuthContext.Provider>
    );
};
