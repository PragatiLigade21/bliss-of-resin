import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Check, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { StarRating } from "./UI";
import { API_URL } from "../utils/api";

const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/400?text=No+Image";

function ProductCard({ product, viewMode = "grid" }) {
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const [isWishlisted, setIsWishlisted] = useState(false);

  // ❌ If product missing → don’t render
  if (!product || !product._id) {
    console.warn("Invalid product:", product);
    return null;
  }

  // ✅ Navigate to product page
  const handleNavigate = () => {
    navigate(`/product/${product._id}`);
  };

  // ✅ Add to cart safely
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const inCart = isInCart(product._id);
  const quantity = getItemQuantity(product._id);

  if (viewMode === "list") {
    return (
      <div
        className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row"
        onClick={handleNavigate}
      >
        {/* IMAGE - List View */}
        <div className="relative w-full md:w-72 aspect-[4/3] md:aspect-square bg-gray-50 dark:bg-gray-700 overflow-hidden flex-shrink-0">
          <img
            src={
              product.image
                ? product.image.startsWith("http")
                  ? product.image
                  : `${API_URL}${product.image}`
                : PLACEHOLDER_IMAGE_URL
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE_URL)}
          />
          <div className="absolute top-4 left-4">
            {product.stock === 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* CONTENT - List View */}
        <div className="p-8 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">{product.category}</p>
              <div className="flex items-center gap-1">
                <StarRating rating={product.rating || 4.5} size="sm" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 text-sm leading-relaxed">
              {product.description || "No description available for this artisanal resin creation."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWishlisted(!isWishlisted);
                }}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isWishlisted ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={isWishlisted ? "white" : "none"} />
              </button>
              
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg ${
                  inCart 
                    ? "bg-green-500 text-white shadow-green-100" 
                    : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 shadow-gray-200"
                }`}
              >
                {inCart ? (
                  <>
                    <Check size={18} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
      onClick={handleNavigate}
    >
      {/* IMAGE - Grid View */}
      <div className="relative aspect-[4/5] bg-gray-50 dark:bg-gray-700 overflow-hidden">
        <img
          src={
              product.image
                ? product.image.startsWith("http")
                  ? product.image
                  : `${API_URL}${product.image}`
                : PLACEHOLDER_IMAGE_URL
            }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE_URL)}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`p-3 rounded-full transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ${
              isWishlisted ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-white text-gray-900 hover:bg-primary hover:text-white shadow-xl"
            }`}
          >
            <Heart size={20} fill={isWishlisted ? "white" : "none"} />
          </button>
          
          <button
            onClick={handleAddToCart}
            className={`p-3 rounded-full transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 shadow-xl ${
              inCart ? "bg-green-500 text-white" : "bg-white text-gray-900 hover:bg-primary hover:text-white"
            }`}
          >
            {inCart ? <Check size={20} /> : <ShoppingCart size={20} />}
          </button>
        </div>
      </div>

      {/* CONTENT - Grid View */}
      <div className="p-5">
        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-2">{product.category}</p>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 dark:text-white">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating || 4.5} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;