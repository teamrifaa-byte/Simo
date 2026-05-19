import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("marinfo_token");
    const user = JSON.parse(localStorage.getItem("marinfo_user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        if (user.role === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;