/**
 * Hero Section - Premium Resin Art Website
 * Elegant, minimal, luxury design with soft pastel colors
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=1920&q=80')`
        }}
      />
      
      {/* Gradient Overlay - Soft pastel blend from left / Dark mode gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FDF8F5]/95 dark:from-[#111827]/95 via-[#FDF8F5]/80 dark:via-[#1F2937]/80 to-transparent dark:to-transparent" />
      
      {/* Decorative blur elements for soft ambiance */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#E8D5D0]/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#F5E6E0]/40 rounded-full blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-28 min-h-[85vh] lg:min-h-[90vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
          
          {/* Left Content - Text aligned left */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 lg:pr-8"
          >
            {/* Small elegant heading */}
            <p className="text-xs sm:text-sm tracking-[0.25em] text-[#9A8A82] dark:text-gray-400 uppercase mb-5 font-medium">
              Handcrafted with Love
            </p>
            
            {/* Large Serif Heading */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#2C2420] dark:text-white mb-7 leading-[1.15] tracking-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Beautiful Resin Art for Your Space
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-[#6B5E56] dark:text-gray-300 mb-10 max-w-lg leading-relaxed">
              Discover our exclusive collection of handcrafted resin pieces. 
              Each artwork is meticulously created to bring timeless elegance 
              and natural beauty into your home.
            </p>
            
            {/* CTA Button - Minimal and elegant */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#2C2420] dark:bg-white text-[#FDF8F5] dark:text-black 
                hover:bg-[#4A3F3A] dark:hover:bg-gray-200 transition-all duration-500 font-normal text-sm tracking-wide
                shadow-lg hover:shadow-xl"
            >
              Explore Collection
              <span className="text-lg">→</span>
            </Link>
          </motion.div>

          {/* Right Content - Image visible on right */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 hidden lg:block"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80"
                  alt="Handcrafted resin art piece with floral design"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              
              {/* Floating elegant badge */}
              <div className="absolute -bottom-6 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5E6E0] flex items-center justify-center">
                    <span className="text-[#2C2420] text-lg">✦</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#9A8A82] uppercase tracking-wider">Quality</p>
                    <p className="text-sm font-medium text-[#2C2420]">100% Handmade</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;