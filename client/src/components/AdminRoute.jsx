import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminRoute Component
 * Protects admin-only routes by checking user role
 * 
 * Usage:
 * <AdminRoute>
 *   <AdminAddProduct />
 * </AdminRoute>
 */
function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  // Redirect to home if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render children if user is admin
  return children;
}

export default AdminRoute;