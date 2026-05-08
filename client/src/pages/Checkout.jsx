import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader, ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button, Card, LoadingState } from "../components/UI";
import { showSuccess, showError } from "../utils/toast";
import { API_URL } from "../utils/api";

function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
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
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
      const authHeaders = getAuthHeaders();
      
      // Safety check: Ensure token exists since backend requires it
      if (!authHeaders.Authorization) {
        throw new Error("You must be logged in to place an order");
      }

      // Prepare order items in the format expected by backend
      const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        product: item._id,
        image: item.image || "/vite.svg" // Use placeholder if image is missing
      }));

      const subtotal = getTotalPrice();
      const shipping = subtotal > 500 ? 0 : 50;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + shipping + tax;

      const orderData = {
        orderItems,
        shippingAddress: {
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          phone: form.phone
        },
        paymentMethod: form.paymentMethod,
        subtotal: subtotal,
        taxAmount: tax,
        shippingCost: shipping,
        totalPrice: total
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
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
      <div className="flex-1 bg-gradient-light dark:bg-gray-900 flex items-center justify-center py-12 transition-colors duration-300">
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
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 py-8 md:py-16 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <p className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3">Secure Checkout</p>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Finalize Order</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Complete your purchase of handcrafted excellence.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-8 text-indigo-600">
                <ShoppingBag size={24} />
                <h3 className="text-xl font-black uppercase tracking-widest text-[10px] text-gray-400">Shipping Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 dark:text-white font-medium"
                    placeholder="Recipient's Name"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Street Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 dark:text-white font-medium"
                    placeholder="House No, Street, Area"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 dark:text-white font-medium"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 dark:text-white font-medium"
                    placeholder="+91 00000 00000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-8 text-pink-600">
                <CreditCard size={24} />
                <h3 className="text-xl font-black uppercase tracking-widest text-[10px] text-gray-400">Payment Selection</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Razorpay", "COD"].map((method) => (
                  <label 
                    key={method}
                    className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === method 
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10" 
                        : "border-gray-100 dark:border-gray-700 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={form.paymentMethod === method}
                      onChange={handleChange}
                      className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">{method === "COD" ? "Cash on Delivery" : method}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                        {method === "Razorpay" ? "Secure Online Payment" : "Pay at your doorstep"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 sticky top-28">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-50 dark:border-gray-700" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Order
              </h3>

              <div className="max-h-64 overflow-y-auto custom-scrollbar mb-8 pr-2 space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                      <img
                        src={`${API_URL}${item.image.startsWith('/') ? item.image : '/' + item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-white">₹{(item.price * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 pt-6 border-t border-gray-50 dark:border-gray-700">
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
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white dark:border-black border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <Check size={18} />
                    Place Order Now
                  </>
                )}
              </button>

              <div className="mt-8 flex items-center justify-center gap-6">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-30 grayscale" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 opacity-30 grayscale" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-30 grayscale" />
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}

export default Checkout;