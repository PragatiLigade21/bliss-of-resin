/**
 * Admin Dashboard Layout
 * Provides sidebar navigation for admin pages
 */

import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  PackagePlus, 
  Package, 
  Menu, 
  X,
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/add-product", label: "Add Product", icon: PackagePlus },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-purple-900 to-purple-800 text-white z-40 shadow-xl"
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-purple-700">
          {sidebarOpen && (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="font-bold text-xl">Bliss Admin</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? "bg-white text-purple-900 font-medium shadow-lg" 
                    : "hover:bg-purple-700 text-purple-100"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-700">
          {sidebarOpen && (
            <div className="mb-4 px-4">
              <p className="text-sm text-purple-200">Logged in as</p>
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-purple-300 truncate">{user?.email}</p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-purple-700 text-purple-100 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 260 : 80 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminDashboard;