/**
 * Home Page - Luxury Resin Art Store
 * Uses new luxury components: Hero, CategorySection, FeaturedProducts
 */

import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import Features from "../components/Features";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Brand Features Section */}
      <Features />

      {/* Category Section */}
      <CategorySection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Section - Luxury Layout */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Image Composite */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80"
                  alt="Resin Art Process"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square rounded-[2rem] overflow-hidden shadow-2xl z-20 border-8 border-white dark:border-gray-900 hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1590736961649-7f1692938170?w=600&q=80"
                  alt="Detail Work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="lg:pl-10">
              <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">
                Our Philosophy
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Crafting Bliss, <br />
                One Piece at a Time
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
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
              
              <div className="mt-12 flex items-center gap-6">
                <Link
                  to="/about"
                  className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg"
                >
                  Discover More
                </Link>
                <div className="flex flex-col">
                  <span className="text-gray-900 dark:text-white font-bold italic" style={{ fontFamily: 'Playfair Display, serif' }}>The Founder</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">Resin Artist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Newsletter Section */}
      <Newsletter />

      <Footer />
    </div>
  );
}

export default Home;