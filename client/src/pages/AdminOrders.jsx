import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Package,
  CreditCard,
  MapPin,
  Calendar,
  ExternalLink,
  X
} from "lucide-react";
import { adminAPI } from "../utils/api";
import toast from "react-hot-toast";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getOrders({ 
        page: currentPage, 
        status: statusFilter,
        limit: 10
      });
      if (data.success) {
        setOrders(data.orders || []);
        setTotalPages(data.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);
      const data = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Update local state
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePayment = async (orderId, isPaid) => {
    try {
      setIsUpdating(true);
      const data = await adminAPI.updatePaymentStatus(orderId, isPaid);
      if (data.success) {
        toast.success(`Payment status updated`);
        setOrders(orders.map(o => o._id === orderId ? { ...o, isPaid } : o));
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, isPaid });
        }
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-emerald-50 text-emerald-600";
      case "shipped": return "bg-blue-50 text-blue-600";
      case "confirmed": return "bg-indigo-50 text-indigo-600";
      case "cancelled": return "bg-red-50 text-red-600";
      case "pending": return "bg-amber-50 text-amber-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Order Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer orders and fulfillment status.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-2xl border border-transparent focus-within:border-indigo-500/30 transition-all">
          <Filter size={16} className="text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}}
            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-600 uppercase tracking-widest cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-1">There are no orders matching your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Info</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Payment</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{order.user?.name || "Guest"}</p>
                      <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        order.isPaid ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}>
                        {order.isPaid ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900">₹{order.totalPrice?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Order Details</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">#{selectedOrder._id.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <UserIcon size={14} className="text-indigo-600" />
                      Customer
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="font-bold text-gray-900">{selectedOrder.user?.name || "Guest Customer"}</p>
                      <p className="text-xs text-gray-500 mt-1">{selectedOrder.user?.email}</p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <CreditCard size={14} className="text-pink-600" />
                      Payment
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="font-bold text-gray-900">{selectedOrder.paymentMethod || "N/A"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${selectedOrder.isPaid ? "bg-emerald-500" : "bg-red-500"}`}></span>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                          {selectedOrder.isPaid ? "Payment Received" : "Awaiting Payment"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <MapPin size={14} className="text-emerald-600" />
                      Shipping Address
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {selectedOrder.shippingAddress?.address},<br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}<br />
                        {selectedOrder.shippingAddress?.country || "India"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Package size={14} className="text-indigo-600" />
                    Order Items
                  </h4>
                  <div className="border border-gray-100 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Price</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Qty</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedOrder.orderItems?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400">
                                <Package size={20} />
                              </div>
                              <p className="text-sm font-bold text-gray-800">{item.name}</p>
                            </td>
                            <td className="px-6 py-4 text-center text-sm font-medium">₹{item.price?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-center text-sm font-bold">{item.quantity}</td>
                            <td className="px-6 py-4 text-right text-sm font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50/30">
                          <td colSpan="3" className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-gray-400">Grand Total</td>
                          <td className="px-6 py-4 text-right text-xl font-black text-indigo-600">₹{selectedOrder.totalPrice?.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Update Status:</p>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                        disabled={isUpdating || selectedOrder.status === status}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${
                          selectedOrder.status === status 
                            ? "bg-gray-900 text-white" 
                            : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-600 hover:text-indigo-600"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {!selectedOrder.isPaid && (
                    <button
                      onClick={() => handleUpdatePayment(selectedOrder._id, true)}
                      disabled={isUpdating}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Mark as Paid
                    </button>
                  )}
                  <button
                    className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <Truck size={16} />
                    Ship Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline Icon fix for modal
const UserIcon = ({ size, className }) => <Users size={size} className={className} />;

export default AdminOrders;
