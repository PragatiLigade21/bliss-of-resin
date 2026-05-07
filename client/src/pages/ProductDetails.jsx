import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  Package, 
  Tag, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { Button, LoadingState, EmptyState, StarRating, Badge } from "../components/UI";
import ProductCard from "../components/ProductCard";
import { productsAPI, API_URL } from "../utils/api";

const PLACEHOLDER_IMAGE_URL = "/vite.svg";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProductAndSimilar = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getProduct(id);

        if (!data.success) {
          throw new Error(data.message || "Product not found");
        }

        setProduct(data.product);

        // Fetch similar products based on category
        const similarData = await productsAPI.getProducts({ 
          category: data.product.category,
          limit: 4 
        });
        
        const filteredSimilar = (similarData.products || [])
          .filter(p => p._id !== id)
          .slice(0, 4);
          
        setSimilarProducts(filteredSimilar);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSimilar();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <LoadingState message="Revealing artisanal details..." />;
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <EmptyState
            title="Masterpiece Not Found"
            message="The specific resin creation you're looking for might have found a new home."
          />
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={20} />
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for(let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inCart = isInCart(product._id);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Breadcrumbs & Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          
          {/* LEFT: Image Gallery Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-2xl group"
            >
              <img
                src={
                  product.image
                    ? product.image.startsWith("http")
                      ? product.image
                      : `${API_URL}${product.image}`
                    : PLACEHOLDER_IMAGE_URL
                }
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {discount > 0 && (
                <div className="absolute top-8 left-8 bg-primary text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                  {discount}% Limited Offer
                </div>
              )}
            </motion.div>
            
            {/* Small Thumbnails (Placeholder for multi-image support) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${i === 0 ? 'border-primary shadow-lg' : 'border-transparent hover:border-gray-200'}`}>
                   <img
                    src={product.image ? (product.image.startsWith("http") ? product.image : `${API_URL}${product.image}`) : PLACEHOLDER_IMAGE_URL}
                    alt=""
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Content Section */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <StarRating rating={product.rating || 4.5} size={16} />
                  <span className="text-xs font-bold text-gray-400 ml-1">(12 Reviews)</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.name}
              </h1>

              <div className="flex items-end gap-4 mb-10">
                <div className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                  ₹{product.price.toLocaleString()}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-2xl text-gray-400 line-through mb-1">
                    ₹{product.originalPrice.toLocaleString()}
                  </div>
                )}
              </div>

              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-xl">
                {product.description}
              </p>

              {/* Purchase Controls */}
              <div className="space-y-8 mb-12">
                {/* Quantity */}
                <div className="flex items-center gap-6">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Quantity</span>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 hover:text-primary transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-black text-gray-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="p-3 hover:text-primary transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} pieces available` : 'Out of Stock'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl hover:shadow-2xl active:scale-95 ${
                      inCart 
                        ? "bg-emerald-500 text-white shadow-emerald-200" 
                        : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                    }`}
                  >
                    {inCart ? <><Check size={20} /> In Cart</> : <><ShoppingCart size={20} /> Add to Cart</>}
                  </button>

                  <button
                    disabled={product.stock === 0}
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
                  >
                    Instant Checkout
                  </button>

                  <button
                    onClick={toggleWishlist}
                    className={`p-5 rounded-full border-2 transition-all active:scale-90 ${
                      isWishlisted 
                        ? "bg-red-50 border-red-500 text-red-500" 
                        : "border-gray-100 dark:border-gray-800 text-gray-400 hover:border-red-200 hover:text-red-400"
                    }`}
                  >
                    <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-10 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <Truck size={20} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Free Express Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    <RefreshCw size={20} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Artisanal Guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM: Tabs Section */}
        <div className="mt-32">
          <div className="flex justify-center border-b border-gray-100 dark:border-gray-800 mb-16">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                  activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 w-full h-1 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto text-center"
            >
              {activeTab === "description" && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Craftsmanship & Story</h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                    {product.description}. Each layer of this {product.category.toLowerCase()} is meticulously poured, 
                    ensuring a depth of color and clarity that defines our artisanal standards. No two pieces are ever identical, 
                    making this a truly unique addition to your collection.
                  </p>
                </div>
              )}
              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left bg-gray-50 dark:bg-gray-800/50 p-12 rounded-[3rem]">
                  <div className="space-y-4">
                    <p className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Material</span>
                      <span className="font-bold text-gray-900 dark:text-white">{product.material || "Premium Epoxy Resin"}</span>
                    </p>
                    <p className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Color</span>
                      <span className="font-bold text-gray-900 dark:text-white">{product.color || "Artisanal Blend"}</span>
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Dimensions</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {typeof product.dimensions === "object"
                          ? `${product.dimensions.width || "10"}W x ${product.dimensions.height || "10"}H x ${product.dimensions.depth || "2"}D`
                          : product.dimensions || "12 x 12 x 2 inches"}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Weight</span>
                      <span className="font-bold text-gray-900 dark:text-white">1.2 kg</span>
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="py-12">
                   <StarRating rating={product.rating || 4.5} size={32} />
                   <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Based on 12 verified purchases</p>
                   <button className="mt-8 px-10 py-4 border-2 border-black dark:border-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                      Write a Review
                   </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SIMILAR PRODUCTS SECTION */}
        {similarProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-3">Curated Selection</p>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Similar Masterpieces</h2>
              </div>
              <Link to="/shop" className="text-xs font-black uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                Explore All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((p, idx) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;