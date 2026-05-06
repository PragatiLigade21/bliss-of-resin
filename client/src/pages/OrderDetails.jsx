import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Truck, CheckCircle, Calendar, MapPin, CreditCard, Clock } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Badge, LoadingState, Button } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../utils/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/${id}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Order not found");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to view this order");
          } else {
            throw new Error("Failed to fetch order details");
          }
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, getAuthHeaders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={20} className="text-green-500" />;
      case "Shipped":
        return <Truck size={20} className="text-blue-500" />;
      default:
        return <Package size={20} className="text-orange-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "primary";
      default:
        return "warning";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingState message="Loading order details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center max-w-md mx-auto">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg text-red-600 mb-6 mx-auto"
            >
              <Package size={32} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Error Loading Order</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              variant="primary"
              onClick={() => navigate("/orders")}
              className="w-full"
            >
              Back to Orders
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <Button
              variant="primary"
              onClick={() => navigate("/orders")}
              className="w-full"
            >
              Back to Orders
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/orders")}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-4xl font-bold">Order Details</h1>
          </div>
          <p className="text-gray-600">
            Order #{order._id?.substring(0, 8).toUpperCase()}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Order Status */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Order Status</h2>
                <Badge
                  variant={getStatusColor(order.isDelivered ? "Delivered" : "Processing")}
                  size="lg"
                >
                  {order.isDelivered ? "Delivered" : "Processing"}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className={`font-semibold ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                      {order.isPaid ? 'Paid' : 'Cash on Delivery'}
                    </p>
                  </div>
                </div>

                {order.isDelivered && order.deliveredAt && (
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Delivered On</p>
                      <p className="font-semibold">{formatDate(order.deliveredAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Order Items */}
            <Card>
              <h2 className="text-2xl font-bold mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={`${API_URL}${item.image.startsWith('/') ? item.image : '/' + item.image}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Price: ₹{item.price} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Order Summary & Shipping */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Shipping Address */}
            <Card>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Shipping Address
              </h3>
              <div className="space-y-2">
                <p className="font-semibold text-lg">{order.shippingAddress?.name}</p>
                <p className="text-gray-600">{order.shippingAddress?.address}</p>
                <p className="text-gray-600">{order.shippingAddress?.city}</p>
                <p className="text-gray-600">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </Card>

            {/* Order Summary */}
            <Card>
              <h3 className="font-bold text-xl mb-6">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({order.orderItems?.length} items)</span>
                  <span>₹{(order.totalPrice * 0.82).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{(order.totalPrice * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-primary">₹{order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card>
              <div className="space-y-3">
                <Link to="/shop" className="w-full">
                  <Button variant="primary" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/orders")}
                >
                  Back to Orders
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;