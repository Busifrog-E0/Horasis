import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const ProtectedAuth = ({ children }) => {
    const { currentUserData } = useContext(AuthContext)
    return currentUserData && currentUserData.CurrentUser ? (
        children
    ) : (
        <Navigate to="/login" />
    );
};

export default ProtectedAuth