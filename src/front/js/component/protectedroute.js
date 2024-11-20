import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("jwt-token"); // Retrieve the token

    if (!token) {
        // Redirect to login page if token is missing
        return <Navigate to="/login" replace />;
    }

    return children; // Render the protected component
};

export default ProtectedRoute;
