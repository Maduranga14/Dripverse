import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    requiredRole?: "ROLE_ADMIN" | "ROLE_CUSTOMER";
}

const ProtectedRoute = ( { requiredRole }: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
        return <Navigate to="/login" replace />
    }

    try {
        const user = JSON.parse(userStr);

        if (requiredRole && user.role !== requiredRole) {
            return <Navigate to="/" replace />
        }

        return <Outlet />
    } catch (e) {
        return <Navigate to= "/login" replace />
    }
};

export default ProtectedRoute;