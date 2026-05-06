/**
 * Hero Section - Premium Resin Art Website
 * Elegant, minimal, luxury design with soft pastel colors
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-[#FDF8F5] dark:bg-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F5E6E0] dark:bg-gray-800 transform skew-x-12 translate-x-1/4 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-semibold tracking-[0.2em] uppercase mb-4 text-sm">
              Exclusive Collection 2024
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Artisanal Resin <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Masterpieces</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
              Transform your living space with our handcrafted, one-of-a-kind resin art pieces. 
              Each creation tells a story of elegance and meticulous craftsmanship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 font-bold"
              >
                Our Story
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8 items-center border-t border-gray-200 dark:border-gray-800 pt-8">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">500+</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Unique Pieces</p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Handmade</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img
                src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80"
                alt="Luxury Resin Art"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center p-4 z-20 hidden md:flex"
            >
              <img src="/tray.jpg" alt="Miniature" className="w-full h-full object-cover rounded-xl" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 z-20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <p className="text-sm font-bold text-gray-900 dark:text-white">Limited Edition Available</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;