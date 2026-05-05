import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sliders, Grid3x3, List } from "lucide-react";
import { Card, Button, LoadingState, EmptyState } from "../components/UI";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import PaginationControls from "../components/PaginationControls";
import Footer from "../components/Footer";
import { productsAPI } from "../utils/api";
import { showError } from "../utils/toast";

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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-8 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shop</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {pagination.total} products found
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64">
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
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                />
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <Sliders size={18} />
                    Filters
                  </button>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded transition-colors duration-300 ${
                        viewMode === "grid"
                          ? "bg-primary text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Grid3x3 size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded transition-colors duration-300 ${
                        viewMode === "list"
                          ? "bg-primary text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-primary transition-colors duration-300"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="best-selling">Best Selling</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6"
              >
                <FilterPanel
                  filters={filters}
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <LoadingState message="Loading products..." />
            ) : errorMessage ? (
              <EmptyState
                title="Unable to load products"
                message={errorMessage}
              />
            ) : activeProducts.length === 0 ? (
              <EmptyState
                title="No Products Found"
                message="Try adjusting your filters or search criteria"
              />
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                      : "space-y-4 mb-8"
                  }
                >
                  {activeProducts.map((product, index) => (
                    <motion.div
                      key={product?._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <PaginationControls
                    page={pagination.page}
                    pages={pagination.pages}
                    onPageChange={(page) =>
                      setPagination(prev => ({ ...prev, page }))
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Shop;
