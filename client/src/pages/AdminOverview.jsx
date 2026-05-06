import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminAPI } from "../utils/api";
import toast from "react-hot-toast";

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminAPI.getDashboardStats();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    { 
      title: "Total Revenue", 
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, 
      change: "+12.5%", 
      isPositive: true,
      icon: TrendingUp,
      color: "indigo"
    },
    { 
      title: "Total Orders", 
      value: stats?.totalOrders || 0, 
      change: "+5.2%", 
      isPositive: true,
      icon: ShoppingBag,
      color: "pink"
    },
    { 
      title: "Total Products", 
      value: stats?.totalProducts || 0, 
      change: "-2.4%", 
      isPositive: false,
      icon: Package,
      color: "emerald"
    },
    { 
      title: "Total Customers", 
      value: stats?.totalUsers || 0, 
      change: "+18.1%", 
      isPositive: true,
      icon: Users,
      color: "amber"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your business performance and recent activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              Recent Orders
            </h3>
            <Link to="/admin/orders" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{order.user?.name || "Guest"}</p>
                      <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        order.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                        order.status === "shipped" ? "bg-blue-50 text-blue-600" :
                        order.status === "cancelled" ? "bg-red-50 text-red-600" :
                        "bg-amber-50 text-amber-600"
                      }`}>
                        {order.status === "delivered" ? <CheckCircle2 size={10} /> :
                         order.status === "cancelled" ? <AlertCircle size={10} /> :
                         <Clock size={10} />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900">₹{order.totalPrice?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Stats / Inventory Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingBag size={18} className="text-pink-600" />
              Order Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Pending</span>
                <span className="text-sm font-bold text-amber-600">{stats?.orderStats?.pending || 0}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full" 
                  style={{ width: `${(stats?.orderStats?.pending / stats?.totalOrders) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Shipped</span>
                <span className="text-sm font-bold text-blue-600">{stats?.orderStats?.shipped || 0}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${(stats?.orderStats?.shipped / stats?.totalOrders) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Delivered</span>
                <span className="text-sm font-bold text-emerald-600">{stats?.orderStats?.delivered || 0}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${(stats?.orderStats?.delivered / stats?.totalOrders) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package size={18} className="text-indigo-600" />
              Popular Products
            </h3>
            <div className="space-y-4">
              {stats?.topProducts?.map((product) => (
                <div key={product._id} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400">
                    <Package size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">₹{product.price} • {product.viewCount} views</p>
                  </div>
                  <div className="text-indigo-600 bg-indigo-50 p-2 rounded-xl">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
