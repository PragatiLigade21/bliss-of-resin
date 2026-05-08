import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sliders, Grid3x3, List, X } from "lucide-react";
import { Card, Button, LoadingState, EmptyState } from "../components/UI";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import PaginationControls from "../components/PaginationControls";
import { productsAPI } from "../utils/api";
import { showError } from "../utils/toast";
import { AnimatePresence } from "framer-motion";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  // Filter and pagination states
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") || "All",
    minPrice: searchParams.get("minPrice") || 0,
    maxPrice: searchParams.get("maxPrice") || 10000,
    rating: searchParams.get("rating") || 0,
    sort: searchParams.get("sort") || "newest",
    inStock: searchParams.get("inStock") === "true"
  });

  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: 100,
    total: 0,
    pages: 0
  });

  const [showFilters, setShowFilters] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productsAPI.getCategories();
        setCategories(["All", ...data.categories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const params = {
          keyword: filters.keyword || undefined,
          category: filters.category === "All" ? undefined : filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          rating: filters.rating,
          sort: filters.sort,
          inStock: filters.inStock,
          page: pagination.page,
          limit: 100
        };

        // Remove undefined values
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

        const data = await productsAPI.getProducts(params);
        console.log("Shop API response:", data);

        // Handle API response - can be { success, products, total } or array
        let loadedProducts = [];
        if (Array.isArray(data)) {
          loadedProducts = data;
        } else if (data && data.products) {
          loadedProducts = data.products;
        } else {
          console.warn("Unexpected API response format:", data);
        }

        setProducts(loadedProducts);
        setPagination(prev => ({
          ...prev,
          total: typeof data.total === "number" ? data.total : loadedProducts.length,
          pages: typeof data.pages === "number" ? data.pages : 1
        }));

        // Update URL
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== "All" && value !== 0) {
            queryParams.set(key, value);
          }
        });
        queryParams.set("page", pagination.page);
        setSearchParams(queryParams);
      } catch (error) {
        console.error("Error fetching products:", error);
        const backendMessage =
          error.message && error.message.toLowerCase().includes("failed to fetch")
            ? "Backend not running. Please start server."
            : "Failed to load products.";

        setErrorMessage(backendMessage);
        showError(backendMessage);
        setProducts([]);
        setPagination(prev => ({ ...prev, total: 0, pages: 0 }));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, pagination.page, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle search
  const handleSearch = (keyword) => {
    handleFilterChange({ keyword });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      keyword: "",
      category: "All",
      minPrice: 0,
      maxPrice: 10000,
      rating: 0,
      sort: "newest",
      inStock: false
    });
  };

  const activeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Premium Header */}
      <section className="bg-[#FDF8F5] dark:bg-gray-800 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">Explore Our Creations</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            The Shop
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <span>Home</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium">All Products</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 z-[70] lg:hidden overflow-y-auto p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterPanel
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* View & Sort Controls */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Grid3x3 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <List size={20} />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Sliders size={18} />
                  Filters
                </button>

                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Showing <span className="text-gray-900 dark:text-white">{activeProducts.length}</span> of <span className="text-gray-900 dark:text-white">{pagination.total}</span> products
              </p>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-100 dark:bg-gray-800 aspect-[4/5] rounded-3xl mb-4" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : activeProducts.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                <EmptyState
                  title="No products found"
                  message="Try adjusting your filters or search keywords"
                  actionLabel="Clear All Filters"
                  onAction={handleClearFilters}
                />
              </div>
            ) : (
              <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {activeProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (index % 6) * 0.1 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-16 flex justify-center">
                <PaginationControls
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
