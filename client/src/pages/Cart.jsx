import { useContext } from "react";
import { motion } from "framer-motion";
import { Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button, Card, QuantitySelector, EmptyState } from "../components/UI";
import Footer from "../components/Footer";
import { showSuccess } from "../utils/toast";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-12 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16"
          >
            <EmptyState
              icon={ShoppingCart}
              title="Your Cart is Empty"
              message="Add some beautiful resin creations to your cart!"
              actionLabel="Continue Shopping"
              onAction={() => (window.location.href = "/shop")}
            />
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="flex gap-4">
                      {/* Product Image */}
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image.startsWith('/') ? item.image : '/' + item.image}`}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.description?.substring(0, 50)}...
                        </p>

                        {/* Price per item */}
                        <p className="text-primary font-bold mt-2">₹{item.price}</p>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <QuantitySelector
                          quantity={item.quantity || 1}
                          onIncrease={() => handleIncrease(item._id, item.quantity || 1)}
                          onDecrease={() => handleDecrease(item._id, item.quantity || 1)}
                        />

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="font-bold text-lg">
                            ₹{item.price * (item.quantity || 1)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemove(item._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Link
                  to="/shop"
                  className="text-primary hover:text-secondary font-medium flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
              </motion.div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card variant="elevated" className="sticky top-24">
                <h3 className="font-bold text-xl mb-6 pb-4 border-b border-gray-200">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {shipping > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span>₹{shipping}</span>
                    </div>
                  )}

                  {shipping === 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Tax (18%)</span>
                    <span>₹{tax}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="w-full">
                  <Button variant="primary" size="lg" className="w-full gap-2">
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Button>
                </Link>

                {shipping > 0 && (
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Free shipping on orders over ₹500
                  </p>
                )}
              </Card>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 bg-white rounded-lg p-4"
              >
                <p className="text-sm text-gray-600">
                  ✓ Secure checkout<br />
                  ✓ Fast delivery<br />
                  ✓ Safe & authentic products
                </p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;