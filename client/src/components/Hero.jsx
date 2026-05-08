/**
 * Hero Section - Premium Resin Art Website
 * Elegant, minimal, luxury design with soft pastel colors
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import resinBanner from "../assets/hero-banner.png";

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FDF8F5] dark:bg-gray-950 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F5E6E0] dark:bg-gray-900/50 transform skew-x-12 translate-x-1/4 hidden lg:block" />
      
      {/* Animated Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-full border border-primary/10 mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-[10px]">Exclusive Collection 2024</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-[1.1]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">Everyday Bliss</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-lg leading-relaxed font-light">
              Discover the mesmerizing world of artisanal resin creations. 
              Each piece is a unique fusion of fluid art and functional elegance, 
              handcrafted to bring luxury into your home.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Link
                to="/shop"
                className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-black dark:hover:bg-gray-100 transition-all duration-500 font-bold shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="group flex items-center gap-3 text-gray-900 dark:text-white font-bold py-4 px-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                Our Story
                <span className="w-10 h-px bg-gray-300 group-hover:w-14 transition-all duration-500" />
              </Link>
            </div>

            {/* Stats - Refined */}
            <div className="mt-16 grid grid-cols-2 gap-12 max-w-sm">
              <div className="space-y-1">
                <p className="text-4xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>500+</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Unique Creations</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>100%</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Artisan Made</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative z-10 group">
              <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[12px] border-white dark:border-gray-800 transition-all duration-700 group-hover:rounded-[2.5rem]">
                <img
                  src={resinBanner}
                  alt="Luxury Resin Art"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              {/* Floating Miniature Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-12 w-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-4 z-20 hidden md:block border border-white/20"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                  <img src="/images/earrings.jpg" alt="Miniature" className="w-full h-full object-cover" />
                </div>
                <div className="px-2">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">New Arrival</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Resin Earrings - Teal Drops</p>
                </div>
              </motion.div>
              
              {/* Experience Badge */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-gray-900 dark:bg-white rounded-[2rem] shadow-2xl px-8 py-6 z-20 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 dark:border-white bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white dark:text-gray-900 text-sm font-bold">2k+ Happy Clients</p>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(i => (
                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Background Decorative Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/5 rounded-full -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-primary/5 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;