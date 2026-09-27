import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem("adminToken");

    if (token === null) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}