import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowRight, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../utils/api";

function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart
  } = useCart();

  const subtotal = totalPrice;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleIncrease = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrease = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity - 1);
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-8 md:py-16 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <p className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3">Your Selection</p>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Shopping Bag</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {totalItems} item{totalItems !== 1 ? "s" : ""} currently in your bag
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center bg-white dark:bg-gray-800 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 px-6"
          >
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Your bag is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">
              It seems you haven't added any artisanal resin masterpieces to your collection yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-xl"
            >
              Start Exploring
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white dark:bg-gray-800 p-4 md:p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 items-center"
                  >
                    {/* Product Image */}
                    <div className="w-full md:w-32 aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                      <img
                        src={`${API_URL}${item.image.startsWith('/') ? item.image : '/' + item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 text-center md:text-left min-w-0">
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">{item.category}</p>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 line-clamp-1">
                        {item.description}
                      </p>
                      <p className="text-gray-900 dark:text-white font-black text-lg mt-3 md:mt-4">₹{item.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-row md:flex-col items-center justify-between gap-6 w-full md:w-auto md:border-l md:border-gray-50 md:dark:border-gray-700 md:pl-6">
                      <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-full p-1 border border-gray-100 dark:border-gray-700">
                        <button 
                          onClick={() => handleDecrease(item._id, item.quantity || 1)}
                          className="p-2 hover:text-primary transition-colors text-gray-400"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-black text-gray-900 dark:text-white text-sm">{item.quantity || 1}</span>
                        <button 
                          onClick={() => handleIncrease(item._id, item.quantity || 1)}
                          className="p-2 hover:text-primary transition-colors text-gray-400"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                        title="Remove from bag"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
                <Link
                  to="/shop"
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                >
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Link>
                
                <button 
                  onClick={clearCart}
                  className="text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                >
                  Clear Entire Bag
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 sticky top-28">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-50 dark:border-gray-700" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-black">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-emerald-500 font-black uppercase tracking-tighter">Free</span>
                    ) : (
                      <span className="text-gray-900 dark:text-white font-black">₹{shipping}</span>
                    )}
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Tax (18%)</span>
                    <span className="text-gray-900 dark:text-white font-black">₹{tax.toLocaleString()}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between">
                    <span className="text-lg font-black text-gray-900 dark:text-white">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-indigo-600">₹{total.toLocaleString()}</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">incl. all taxes</p>
                    </div>
                  </div>
                </div>

                <Link to="/checkout" className="block">
                  <button className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    Checkout Securely
                    <ArrowRight size={18} />
                  </button>
                </Link>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Secure SSL Encryption
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Artisanal Quality Guaranteed
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;