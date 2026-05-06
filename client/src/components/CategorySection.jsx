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
      description: "Elegant serving trays for your home."
    },
    {
      id: "Jewelry",
      name: "Handcrafted Jewelry",
      image: "https://plus.unsplash.com/premium_photo-1681276170281-cf50a487a1b7?w=600&auto=format&fit=crop",
      className: "md:col-span-2",
      description: "Unique wearable art."
    },
    {
      id: "Decor",
      name: "Home Decor",
      image: "https://images.unsplash.com/photo-1646469297868-8e723623b7b3?w=600&auto=format&fit=crop",
      className: "md:col-span-1",
      description: "Bespoke pieces for every room."
    },
    {
      id: "Coasters",
      name: "Artistic Coasters",
      image: "https://images.unsplash.com/photo-1676378411543-b38dd1ae1d24?w=600&auto=format&fit=crop",
      className: "md:col-span-1",
      description: "Functional beauty for your table."
    },
  ];

  return (
    <section className="py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Decorative background text */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-[15rem] font-black text-gray-50 dark:text-gray-900/20 select-none -rotate-90 pointer-events-none uppercase tracking-[0.2em] whitespace-nowrap">
        Collections
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Curated Selections</p>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shop by Category
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xl font-light leading-relaxed">
              Explore our diverse collections of artisanal resin creations, each meticulously designed to bring a touch of luxury to your lifestyle.
            </p>
          </div>
          <Link 
            to="/shop" 
            className="group flex items-center gap-3 text-gray-900 dark:text-white font-bold pb-2 border-b-2 border-gray-200 dark:border-gray-800 hover:border-primary transition-all duration-500"
          >
            Browse All
            <span className="w-8 h-px bg-gray-900 dark:bg-white group-hover:w-12 transition-all duration-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-8 h-[900px] md:h-[700px]">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-[3rem] group luxury-shadow ${category.className}`}
            >
              <Link to={`/shop?category=${category.id}`} className="block h-full w-full">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Overlay with glassmorphism on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-700" />
                
                <div className="absolute inset-x-0 bottom-0 p-10 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                  <div className="space-y-3">
                    <p className="text-primary/90 text-[10px] font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      Collection
                    </p>
                    <h3 className="text-white text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {category.name}
                    </h3>
                    <p className="text-white/60 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 max-w-xs">
                      {category.description}
                    </p>
                    <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                      <span className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-all">
                        Explore Now
                      </span>
                    </div>
                  </div>
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