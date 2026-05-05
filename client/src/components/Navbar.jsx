/**
 * Navbar - Luxury Resin Art Store Design
 * With top strip, dropdown categories, and elegant styling
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, LogOut, User, Search, ChevronDown, Flower2, Sun, Moon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const categories = [
    { label: "Trays", path: "/shop?category=Trays" },
    { label: "Jewelry", path: "/shop?category=Jewelry" },
    { label: "Decor", path: "/shop?category=Decor" },
    { label: "Coasters", path: "/shop?category=Coasters" },
  ];

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div className="sticky top-0 z-50">
      {/* Top Strip */}
      <div className="bg-primary/10 text-center py-2 px-4 text-sm text-gray-700 dark:text-gray-300">
        ✨ Free Shipping on Orders Above ₹999 | Handcrafted with Love ❤️
      </div>

      <nav className="bg-white dark:bg-gray-900 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navbar */}
          <div className="flex justify-between items-center h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Flower2 size={24} className="text-primary" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                Bliss of Resin
              </h1>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm"
                >
                  {link.label}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm"
                >
                  Categories
                  <ChevronDown size={16} className={`transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-medium border border-gray-100 dark:border-gray-700 py-2 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.label}
                        to={cat.path}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700 hover:text-primary"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {(user?.role === "admin" || user?.isAdmin) && (
                <Link
                  to="/admin"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 md:gap-5">

              {/* Search Icon */}
              <button className="p-2 hover:bg-cream dark:hover:bg-gray-800 rounded-full transition-colors">
                <Search size={20} className="text-gray-600 dark:text-gray-300" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-cream dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {/* User Icon */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 hover:bg-cream dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <User size={20} className="text-gray-600 dark:text-gray-300" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-medium border border-gray-100 dark:border-gray-700 py-2 z-50">
                      <p className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="px-4 py-1 font-medium text-gray-900 dark:text-white truncate text-sm">{user?.name}</p>
                      <hr className="my-2 border-gray-200 dark:border-gray-600" />
                      
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 hover:bg-cream dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <User size={20} className="text-gray-600 dark:text-gray-300" />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-cream dark:hover:bg-gray-800 rounded-full transition-colors">
                <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} className="text-gray-700 dark:text-gray-300" /> : <Menu size={24} className="text-gray-700 dark:text-gray-300" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-100 dark:border-gray-700 py-4">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Categories */}
                <div className="py-2">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Categories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.label}
                      to={cat.path}
                      className="block text-gray-600 hover:text-primary py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>

                {(user?.role === "admin" || user?.isAdmin) && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-primary font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;