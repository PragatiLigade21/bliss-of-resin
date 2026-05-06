/**
 * Navbar - Luxury Resin Art Store Design
 * With top strip, dropdown categories, and elegant styling
 */

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, LogOut, User, Search, ChevronDown, Flower2, Sun, Moon, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsCategoriesOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const categories = [
    { label: "Luxury Trays", path: "/shop?category=Trays" },
    { label: "Handcrafted Jewelry", path: "/shop?category=Jewelry" },
    { label: "Home Decor", path: "/shop?category=Decor" },
    { label: "Artistic Coasters", path: "/shop?category=Coasters" },
  ];

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/shop" },
    { label: "Our Story", path: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-[#2C2420] text-white py-2 px-4 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] relative z-[60]">
        ✨ Free shipping on orders above ₹999 | Artisanal Excellence
      </div>

      <nav 
        className={`w-full transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-3 shadow-lg" 
            : "bg-white dark:bg-gray-900 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Left Section - Desktop Links */}
            <div className="hidden lg:flex items-center gap-10 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`relative text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                    location.pathname === link.path ? "text-primary" : "text-gray-900 dark:text-gray-300"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div layoutId="navUnderline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
                  )}
                </Link>
              ))}
              
              <div className="relative">
                <button
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-gray-900 dark:text-gray-300 hover:text-primary"
                >
                  Explore
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseLeave={() => setIsCategoriesOpen(false)}
                      className="absolute top-full left-0 mt-4 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-4 z-50"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.label}
                          to={cat.path}
                          className="block px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Center Section - Logo */}
            <Link to="/" className="flex flex-col items-center gap-0 flex-shrink-0 group">
              <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter transition-all group-hover:scale-105" style={{ fontFamily: 'Playfair Display, serif' }}>
                Bliss <span className="text-primary italic font-serif lowercase">of</span> Resin
              </span>
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] -mt-1">Handcrafted Luxury</span>
            </Link>

            {/* Right Section - Icons */}
            <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
              {/* Desktop Only Icons */}
              <div className="hidden sm:flex items-center gap-2">
                <button className="p-2.5 text-gray-900 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all">
                  <Search size={20} />
                </button>
                <button 
                  onClick={toggleTheme}
                  className="p-2.5 text-gray-900 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all"
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>

              {/* User / Profile */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-2.5 text-gray-900 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all"
                    >
                      <User size={20} />
                    </button>
                    
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 mt-4 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-4 z-50 overflow-hidden"
                        >
                          <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Account</p>
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                          </div>
                          <div className="p-2">
                            {(user?.role === "admin" || user?.isAdmin) && (
                              <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all">
                                Admin Dashboard
                              </Link>
                            )}
                            <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all">
                              My Orders
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                              <LogOut size={16} /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link to="/login" className="p-2.5 text-gray-900 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all">
                    <User size={20} />
                  </Link>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2.5 text-gray-900 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-lg shadow-primary/20">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2.5 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-6 py-10 flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      className="text-2xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Collections</p>
                  <div className="grid grid-cols-1 gap-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.label}
                        to={cat.path}
                        className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                   <button 
                    onClick={toggleTheme}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-xs font-bold uppercase tracking-widest"
                  >
                    {theme === "light" ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} /> Light Mode</>}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Navbar;