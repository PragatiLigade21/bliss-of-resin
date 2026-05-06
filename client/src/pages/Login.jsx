import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Card } from "../components/UI";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Get redirect path from URL params
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }
    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(form.email, form.password);

      if (result.success) {
        setTimeout(() => navigate(redirectTo), 1000);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row transition-colors duration-500">
      {/* Left Section: Visual/Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2C2420] p-20 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="inline-block group">
            <span className="text-3xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
              Bliss <span className="text-primary italic font-serif lowercase">of</span> Resin
            </span>
            <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500" />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Welcome Back to <br />
            <span className="text-primary">Artisanal</span> Luxury
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Sign in to access your curated collection, track orders, and experience the mesmerizing fluidity of resin art.
          </p>
        </div>

        <div className="relative z-10 flex gap-12">
          <div>
            <p className="text-2xl font-black text-white">500+</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Unique Pieces</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">100%</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Handmade</p>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[100px]" />
      </div>

      {/* Right Section: Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left mb-12">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Sign In</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-[10px]">Access your artisanal account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 dark:text-white font-medium shadow-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2 ml-1">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
                  <Link to="/forgot-password" size="xs" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 dark:text-white font-medium shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white dark:border-black border-t-transparent rounded-full"></div>
              ) : (
                <>
                  Sign In to Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              New to Bliss of Resin?{" "}
              <Link
                to="/register"
                className="text-primary font-black uppercase tracking-widest text-xs hover:text-secondary transition-colors ml-2"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;