/**
 * Home Page - Luxury Resin Art Store
 * Uses new luxury components: Hero, CategorySection, FeaturedProducts
 */

import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import Features from "../components/Features";
import Newsletter from "../components/Newsletter";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Brand Features Section */}
      <Features />

      {/* Category Section */}
      <CategorySection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Section - Luxury Layout */}
      <section className="py-32 bg-white dark:bg-gray-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            {/* Image Composite */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] relative z-10 border-[16px] border-gray-50 dark:border-gray-900">
                <img
                  src="https://images.unsplash.com/photo-161https://www.pexels.com/photo/a-person-pouring-resin-7256642/7103996702-96ff29b1c467?w=800&q=80"
                  alt="Resin Art Process"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -bottom-12 -right-12 w-2/3 aspect-square rounded-[3rem] overflow-hidden shadow-2xl z-20 border-[12px] border-white dark:border-gray-950 hidden md:block"
              >
                <img
                  src="https://images.unsplash.com/photo-1590736961649-7f1692938170?w=600&q=80"
                  alt="Detail Work"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Decorative background circle */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </motion.div>
            
            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="lg:pl-10"
            >
              <p className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-6">
                Our Philosophy
              </p>
              <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-10 leading-[1.1]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Crafting Bliss, <br />
                <span className="italic font-light">One Piece at a Time</span>
              </h2>
              <div className="space-y-8 text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                <p>
                  At Bliss of Resin, we believe that art should be a part of your everyday life. 
                  Our journey began with a passion for the mesmerizing interplay of light and 
                  fluidity that only resin can provide.
                </p>
                <p>
                  Each item in our collection is 100% handcrafted in our studio, ensuring that 
                  no two pieces are ever identical. We use only the highest grade, non-toxic 
                  resins and premium pigments to create durable, high-gloss finishes that 
                  capture the imagination.
                </p>
              </div>
              
              <div className="mt-16 flex flex-wrap items-center gap-10">
                <Link
                  to="/about"
                  className="group relative px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold overflow-hidden shadow-xl"
                >
                  <span className="relative z-10">Discover More</span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-px bg-gray-200 dark:bg-gray-800" />
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white font-bold text-xl italic" style={{ fontFamily: 'Playfair Display, serif' }}>The Founder</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Master Resin Artist</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA / Newsletter Section */}
      <Newsletter />
    </div>
  );
}

export default Home;