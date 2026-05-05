import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Heart, Star, Package, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button, LoadingState, EmptyState, StarRating } from "../components/UI";

const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/400?text=No+Image";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Product ID:", id);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/products/${id}`);
        const data = await response.json();
        console.log("API response:", data);

        if (!data.success) {
          throw new Error(data.message || "Product not found");
        }

        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading product details..." />;
  }

  if (error) {
    return (
      <div className="text-center">
  <EmptyState
    title="Product Not Found"
    message="The product you're looking for doesn't exist or has been removed."
  />
  <button
    onClick={() => navigate("/shop")}
    className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg"
  >
    Back to Shop
  </button>
</div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="md:flex">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:w-1/2"
            >
              <div className="aspect-square bg-gray-100">
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
                />
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:w-1/2 p-8"
            >
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">
                    ₹{product.price}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <div className="text-xl text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </div>
                      <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                        {discount}% OFF
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.rating} size={20} />
                  <span className="text-gray-600">({product.rating})</span>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <Package size={20} className={product.stock > 0 ? "text-green-600" : "text-red-600"} />
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>

              <div className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {product.description}
              </div>

              {/* Additional Details */}
              {product.material && (
                <div className="mb-4">
                  <strong className="text-gray-900 dark:text-white">Material:</strong> <span className="text-gray-600 dark:text-gray-300">{product.material}</span>
                </div>
              )}
              {product.color && (
                <div className="mb-4">
                  <strong className="text-gray-900 dark:text-white">Color:</strong> <span className="text-gray-600 dark:text-gray-300">{product.color}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="mb-4">
                  <strong className="text-gray-900 dark:text-white">Dimensions:</strong>{" "}
                  <span className="text-gray-600 dark:text-gray-300">
                    {typeof product.dimensions === "object"
                      ? `${product.dimensions.width || ""}W x ${product.dimensions.height || ""}H x ${product.dimensions.depth || ""}D`
                      : product.dimensions}
                  </span>
                </div>
              )}    

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="flex items-center justify-center gap-2"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-center gap-2"
                  onClick={toggleWishlist}
                >
                  <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="lg"
                className="flex items-center justify-center gap-2"
                onClick={() => navigate("/shop")}
              >
                <ArrowLeft size={20} />
                Back to Shop
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetails;