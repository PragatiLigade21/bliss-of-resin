import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Calendar } from "lucide-react";
import { Card, Badge, LoadingState, EmptyState } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { API_URL } from "../utils/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, getAuthHeaders } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/my-orders`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, getAuthHeaders]);

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
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your purchases</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && <LoadingState message="Loading your orders..." />}

        {!loading && orders.length === 0 && (
          <EmptyState
            icon={Package}
            title="No Orders Yet"
            message="Start shopping to place your first order!"
            actionLabel="Continue Shopping"
            onAction={() => (window.location.href = "/shop")}
          />
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">
                          Order #{order._id?.substring(0, 8).toUpperCase()}
                        </h3>
                        <Badge
                          variant={getStatusColor(order.isDelivered ? "Delivered" : "Placed")}
                          size="sm"
                        >
                          {order.isDelivered ? "Delivered" : "Processing"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar size={16} />
                        {formatDate(order.createdAt || new Date())}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-3xl font-bold text-primary">
                        ₹{order.totalPrice?.toFixed(2) || 0}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Order Items ({order.orderItems?.length || 0})</h4>
                    <div className="space-y-3">
                      {order.orderItems?.slice(0, 2).map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          {item.image && (
                            <img
                              src={`${API_URL}${item.image.startsWith('/') ? item.image : '/' + item.image}`}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 ml-3">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </motion.div>
                      ))}
                      {order.orderItems?.length > 2 && (
                        <p className="text-sm text-gray-600 text-center">
                          +{order.orderItems.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Details & Actions */}
                  <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        Shipping To
                      </p>
                      <p className="font-semibold">
                        {order.shippingAddress?.name || "Delivery Address"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.city} - {order.shippingAddress?.phone}
                      </p>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Payment Status
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.isPaid ? "Paid" : "Pending")}
                          <span className="font-semibold">
                            {order.isPaid ? "Paid" : "Cash on Delivery"}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/order/${order._id}`}
                        className="mt-4 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-secondary transition-colors text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Delivery Status */}
                  {order.status === "Delivered" && (
                    <p className="text-sm text-green-600 mt-4 pt-4 border-t border-gray-200">
                      ✓ Delivered on{" "}
                      {formatDate(order.deliveredAt || new Date())}
                    </p>
                  )}
                  {order.status === "Shipped" && (
                    <p className="text-sm text-blue-600 mt-4 pt-4 border-t border-gray-200">
                      📦 On the way to you
                    </p>
                  )}

                  {/* Track Order Button */}
                  {order.status && order.status !== "Delivered" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 w-full px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Track Order
                    </motion.button>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;