import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user, fetchUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Jika sudah ada user di store (dari persist), langsung set initialized
      if (user) {
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      // Jika isAuthenticated true tapi user null, fetch user
      if (isAuthenticated && !user) {
        try {
          await fetchUser();
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } else {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initAuth();
  }, [isAuthenticated, user, fetchUser]);

  // Loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access
  if (requireAdmin && user.role?.name !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // return <>{children}</>;
  return <Outlet />;
}