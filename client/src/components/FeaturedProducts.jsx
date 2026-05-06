/**
 * Featured Products Section - Luxury Resin Art Store Design
 * Grid of products with elegant styling
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { Spinner } from "./UI";
import { API_URL } from "../utils/api";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products?limit=8`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <p className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
              Handpicked For You
            </p>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Best Sellers
            </h2>
          </div>
          
          <Link
            to="/shop"
            className="group flex items-center gap-4 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View All Products
            <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-gray-900 group-hover:translate-x-2 transition-transform duration-500">
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="space-y-4 text-center">
              <Spinner size="lg" />
              <p className="text-gray-400 text-sm animate-pulse">Curating pieces...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative">
                  <ProductCard product={product} />
                  {index < 2 && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Trending
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-32 glass-morphism rounded-[3rem]">
            <p className="text-gray-500 text-xl font-light italic">No products available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;