import { motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * FilterPanel Component
 * Displays filter options for products
 */
function FilterPanel({ filters, categories, onFilterChange, onClearFilters }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-8 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-xs font-bold text-primary uppercase tracking-widest hover:text-secondary transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Collections</h4>
        <div className="space-y-3">
          {categories.map(category => (
            <label key={category} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => onFilterChange({ category: e.target.value })}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-200 dark:border-gray-600 rounded-full checked:border-primary transition-all cursor-pointer"
                />
                <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200" />
              </div>
              <span className={`ml-3 text-sm transition-colors duration-200 ${
                filters.category === category 
                  ? "text-gray-900 dark:text-white font-bold" 
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
              }`}>
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Price Range</h4>
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-gray-900 dark:text-white">₹{filters.minPrice}</span>
            <span className="text-gray-400 dark:text-gray-500">—</span>
            <span className="text-gray-900 dark:text-white">₹{filters.maxPrice}</span>
          </div>
          
          <div className="space-y-4">
            <div className="relative h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) })}
                className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Minimum Rating</h4>
        <div className="space-y-3">
          {[4, 3, 2, 1, 0].map(rating => (
            <label key={rating} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={Number(filters.rating) === rating}
                  onChange={(e) => onFilterChange({ rating: Number(e.target.value) })}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-200 dark:border-gray-600 rounded-full checked:border-primary transition-all cursor-pointer"
                />
                <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200" />
              </div>
              <span className={`ml-3 text-sm transition-colors duration-200 ${
                Number(filters.rating) === rating 
                  ? "text-gray-900 dark:text-white font-bold" 
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
              }`}>
                {rating === 0 ? "Any Rating" : (
                  <div className="flex items-center gap-1">
                    {rating} <span className="text-yellow-400">★</span> & Up
                  </div>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Filter */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <label className="flex items-center group cursor-pointer">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onFilterChange({ inStock: e.target.checked })}
              className="peer appearance-none w-5 h-5 border-2 border-gray-200 dark:border-gray-600 rounded-lg checked:bg-primary checked:border-primary transition-all cursor-pointer"
            />
            <svg className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="ml-3 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            In Stock Only
          </span>
        </label>
      </div>
    </motion.div>
  );
}

export default FilterPanel;
