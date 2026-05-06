import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  ArrowLeft, 
  Upload, 
  X, 
  CheckCircle2, 
  Info,
  Layers,
  IndianRupee,
  Database
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";

function AdminAddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Resin Art",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("stock", form.stock);
    data.append("description", form.description);

    if (image) {
      data.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data,
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response received:", text);
        throw new Error("Server returned an unexpected response format (HTML). Please check backend logs.");
      }

      if (result.success) {
        toast.success("Product added successfully!");
        navigate("/admin/products");
      } else {
        toast.error(result.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Add product error:", err);
      toast.error(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/admin/products")}
          className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">Create a new artisanal resin masterpiece for your collection.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Info size={18} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Product Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Ocean Blue Resin Tray"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Description</label>
                <textarea
                  name="description"
                  rows="5"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell the story behind this piece..."
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-medium resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 text-pink-600 mb-2">
              <IndianRupee size={18} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Pricing & Inventory</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-black"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Stock Quantity</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-black"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Category & Image */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <Layers size={18} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Classification</h3>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-bold appearance-none cursor-pointer"
              >
                <option>Resin Art</option>
                <option>Resin Trays</option>
                <option>Jewelry</option>
                <option>Home Decor</option>
                <option>Accessories</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Upload size={18} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Product Media</h3>
            </div>

            <div className="space-y-4">
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform mb-3">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-500">Click to upload image</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">PNG, JPG or WEBP</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
              ) : (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-[2rem] border border-gray-100"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Publish Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminAddProduct;