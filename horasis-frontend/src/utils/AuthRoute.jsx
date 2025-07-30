import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const AuthRoute = ({ children }) => {
    const { currentUserData } = useContext(AuthContext)


    return currentUserData ? (
        <Navigate to="/Registration" />
    ) : (
        children
    );
};

export default AuthRoute