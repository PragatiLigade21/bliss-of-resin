/**
 * Home Page - Luxury Resin Art Store
 * Uses new luxury components: Hero, CategorySection, FeaturedProducts
 */

import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <Hero />

      {/* Category Section */}
      <CategorySection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Section */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-medium">
              <img
                src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80"
                alt="About Bliss of Resin"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Content */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Our Story
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                About Bliss of Resin
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We create unique, handcrafted resin art pieces designed to bring elegance to your space. 
                Each item is meticulously crafted with attention to detail, using premium materials to ensure 
                lasting beauty and quality.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Our collection includes stunning trays, jewelry, home decor items, and coasters - all 
                designed to transform your everyday items into works of art.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 font-medium"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Explore Our Collection?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Discover our handcrafted resin art pieces designed to elevate your space.
          </p>
          <a
            href="/shop"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 font-medium"
          >
            Shop Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;