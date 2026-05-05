import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Check, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { StarRating } from "./UI";

const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/400?text=No+Image";

function ProductCard({ product }) {
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
    console.log("Navigating to:", product._id);
    navigate(`/product/${product._id}`);
  };

  // ✅ Add to cart safely
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const inCart = isInCart(product._id);
  const quantity = getItemQuantity(product._id);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-300"
      onClick={handleNavigate}
    >
      {/* IMAGE */}
      <div className="relative aspect-square bg-gray-50 dark:bg-gray-700">
        <img
          src={
            product.image
              ? product.image.startsWith("http")
                ? product.image
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`
              : PLACEHOLDER_IMAGE_URL
          }
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE_URL)}
        />

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-300 ${
            isWishlisted ? "bg-red-500 text-white" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          <Heart size={16} fill={isWishlisted ? "white" : "none"} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-1 mb-2">
          <StarRating rating={product.rating || 4} count={product.reviews || 0} />
        </div>

        {/* Price */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          ₹{product.price}
        </p>

        {/* BUTTON */}
        <button
          onClick={handleAddToCart}
          className={`mt-3 w-full py-2 rounded-md text-sm flex items-center justify-center gap-2 transition-colors duration-300 ${
            inCart
              ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
          }`}
        >
          {inCart ? (
            <>
              <Check size={16} /> Added ({quantity})
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;