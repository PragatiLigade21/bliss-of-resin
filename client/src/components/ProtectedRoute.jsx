import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { Button, Card } from "../components/UI";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          <Card variant="elevated">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg text-red-600 mb-6 mx-auto"
            >
              <Lock size={32} />
            </motion.div>

            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access this page. Please sign in to continue.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
                onClick={() => window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`}
              >
                <LogIn size={18} />
                Sign In
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = "/register"}
              >
                Create Account
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-primary hover:text-secondary font-medium"
              >
                Sign up here
              </a>
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;