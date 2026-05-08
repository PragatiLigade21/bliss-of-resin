import { createContext, useContext, useState, useEffect } from "react";
import { showSuccess, showError } from "../utils/toast";
import { API_URL } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          console.log("✅ Auto-login successful:", userData.email);
        }
      } catch (error) {
        console.error("❌ Error loading user from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log("🔄 Attempting login for:", email);
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save to state
      setUser(data.user);
      setToken(data.token);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      console.log("✅ Login successful:", data.user.email);
      showSuccess(`Welcome back, ${data.user.name}!`);

      return { success: true };

    } catch (error) {
      console.error("❌ Login error:", error);
      showError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      console.log("🔄 Attempting registration for:", email);
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle non-JSON response (e.g., HTML error page from server)
        const text = await response.text();
        console.error("❌ Server returned non-JSON response:", text);
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save to state
      setUser(data.user);
      setToken(data.token);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      console.log("✅ Registration successful:", data.user.email);
      showSuccess(`Welcome to Bliss of Resin, ${data.user.name}!`);

      return { success: true };

    } catch (error) {
      console.error("❌ Registration error:", error);
      showError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    console.log("🔄 Logging out user:", user?.email);

    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart"); // Also clear cart on logout

    showSuccess("Logged out successfully!");
  };

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    getAuthHeaders,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};