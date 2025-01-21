import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
// If the user is not authenticated, redirect to login
if (!isAuthenticated) {
return <Navigate to="/login" replace />;
}

// Otherwise, render the children components
return children;
};

export default ProtectedRoute;
