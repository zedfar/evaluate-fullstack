import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

interface PublicRouteProps {
    children?: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
    const { isAuthenticated, user } = useAuthStore();

    // Jika sudah login, redirect ke dashboard sesuai role
    if (isAuthenticated && user) {
        const redirectPath = user.role?.name === "admin" 
            ? "/admin/dashboard" 
            : "/home";
        
        return <Navigate to={redirectPath} replace />;
    }

    // return <>{children}</>;
    return <Outlet />;
}