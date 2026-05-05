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
      name: "Trays",
      image: "https://images.unsplash.com/photo-1620985828427-52189e3fe1ba?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Elegant serving trays",
    },
    {
      id: "Jewelry",
      name: "Jewelry",
      image: "https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amV3ZWxyeSUyMHN0b3JlfGVufDB8fDB8fHww",
      description: "Stunning accessories",
    },
    {
      id: "Decor",
      name: "Decor",
      image: "https://images.unsplash.com/photo-1646469297868-8e723623b7b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJlc2luJTIwaG9tZSUyMGRlY29yfGVufDB8fDB8fHww",
      description: "Beautiful home decor",
    },
    {
      id: "Coasters",
      name: "Coasters",
      image: "https://images.unsplash.com/photo-1676378411543-b38dd1ae1d24?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzaW4lMjBjb2FzdGVyfGVufDB8fDB8fHww",
      description: "Protective coasters",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
            Explore Our
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Collections
          </h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/shop?category=${category.id}`}
                className="group block relative overflow-hidden rounded-xl aspect-square"
              >
                {/* Image with Zoom Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <h3 className="text-white text-lg md:text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {category.description}
                  </p>
                </div>

                {/* Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;