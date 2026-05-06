/**
 * Category Section - Luxury Resin Art Store Design
 * 4 category cards with hover zoom effect
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function CategorySection() {
  const categories = [
    {
      id: "Trays",
      name: "Luxury Trays",
      image: "https://images.unsplash.com/photo-1620985828427-52189e3fe1ba?q=80&w=1074&auto=format&fit=crop",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      id: "Jewelry",
      name: "Handcrafted Jewelry",
      image: "https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?w=600&auto=format&fit=crop",
      className: "md:col-span-2",
    },
    {
      id: "Decor",
      name: "Home Decor",
      image: "https://images.unsplash.com/photo-1646469297868-8e723623b7b3?w=600&auto=format&fit=crop",
      className: "md:col-span-1",
    },
    {
      id: "Coasters",
      name: "Artistic Coasters",
      image: "https://images.unsplash.com/photo-1676378411543-b38dd1ae1d24?w=600&auto=format&fit=crop",
      className: "md:col-span-1",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Explore our diverse collections of artisanal resin creations, each designed to bring a touch of luxury to your lifestyle.
            </p>
          </div>
          <Link to="/shop" className="text-primary font-bold hover:text-secondary transition-colors border-b-2 border-primary pb-1">
            Browse All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-3xl group ${category.className}`}
            >
              <Link to={`/shop?category=${category.id}`} className="block h-full w-full">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 uppercase tracking-widest">
                    Explore Collection →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;