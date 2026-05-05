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
      className="bg-white rounded-lg border border-gray-100 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 text-sm">Category</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="w-4 h-4 text-gray-900"
              />
              <span className="text-sm text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 text-sm">Price Range</h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-500">Min: ₹{filters.minPrice}</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Max: ₹{filters.maxPrice}</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 text-sm">Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1, 0].map(rating => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={Number(filters.rating) === rating}
                onChange={(e) => onFilterChange({ rating: Number(e.target.value) })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">
                {rating === 0 ? "Any Rating" : `${rating}+ ⭐`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Filter */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({ inStock: e.target.checked })}
            className="w-4 h-4 text-primary rounded"
          />
          <span className="text-sm font-medium">In Stock Only</span>
        </label>
      </div>
    </motion.div>
  );
}

export default FilterPanel;
