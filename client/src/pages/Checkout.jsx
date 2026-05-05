import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader, ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button, Card, LoadingState } from "../components/UI";
import Footer from "../components/Footer";
import { showSuccess, showError } from "../utils/toast";

function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user, getAuthHeaders } = useAuth();

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    phone: "",
    paymentMethod: "COD"
  });

  // Check if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Card className="text-center max-w-md">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg text-gray-600 mb-6 mx-auto"
          >
            <ShoppingBag size={32} />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/shop")}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.phone.match(/^[0-9]{10}$/))
      newErrors.phone = "Valid 10-digit phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please fix the errors above");
      return;
    }

    setLoading(true);

    try {
      // Prepare order items in the format expected by backend
      const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        product: item._id,
        image: item.image
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          phone: form.phone
        },
        paymentMethod: form.paymentMethod,
        totalPrice: getTotalPrice()
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Clear cart and show success
      clearCart();
      setOrderPlaced(true);
      showSuccess("Order placed successfully! 🎉");

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate("/orders");
      }, 3000);

    } catch (err) {
      console.error("Checkout error:", err);
      showError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  // Success State
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-light dark:bg-gray-900 flex items-center justify-center py-12 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-24 h-24 bg-green-500 text-white rounded-full mb-6 mx-auto"
          >
            <Check size={48} />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you for your order</p>
          <p className="text-2xl font-bold text-primary mb-6">₹{total}</p>

          <Card className="mb-6 text-left bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">Order will be delivered to:</p>
            <p className="font-semibold">{form.name}</p>
            <p className="text-sm text-gray-600">{form.address}, {form.city}</p>
          </Card>

          <p className="text-gray-600 mb-6">
            Redirecting to your orders... Check email for confirmation
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-12 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <Card>
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary transition-colors ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="1234567890"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card>
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={form.paymentMethod === "COD"}
                      onChange={handleChange}
                      className="text-primary focus:ring-primary"
                    />
                    <CreditCard size={24} className="text-gray-600" />
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin mr-2" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order - ₹${total.toFixed(2)}`
                )}
              </Button>
            </form>
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

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image.startsWith('/') ? item.image : '/' + item.image}`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity || 1} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
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

                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;