import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  CheckCircle2, 
  Info,
  Layers,
  IndianRupee,
  Save,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import { productsAPI, API_BASE_URL, API_URL } from "../utils/api";

const CATEGORIES = [
  "Resin Art",
  "Resin Trays",
  "Jewelry",
  "Home Decor",
  "Accessories",
  "Other"
];

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "Resin Art",
    stock: "",
    description: "",
    image: ""
  });
  
  // Image state
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load product on mount
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getProduct(id);
      const product = data.product;
      
      if (product) {
        setFormData({
          name: product.name || "",
          price: product.price || "",
          originalPrice: product.originalPrice || "",
          category: product.category || "Resin Art",
          stock: product.stock || "",
          description: product.description || "",
          image: product.image || ""
        });
        
        // Set image preview
        if (product.image) {
          setImagePreview(product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`);
        }
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const uploadUrl = `${API_BASE_URL}/products/upload`;
      
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formDataUpload
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error("Server returned an unexpected response format (HTML). Please check backend logs.");
      }

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to upload image");
      }

      return data.image;
    } catch (error) {
      console.error("Upload image error:", error);
      throw error;
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      let imagePath = formData.image;

      // Upload new image if selected
      if (image) {
        setUploading(true);
        try {
          imagePath = await uploadImage(image);
        } catch (uploadError) {
          toast.error(`Image upload failed: ${uploadError.message}`);
          setUploading(false);
          setSaving(false);
          return; // Stop form submission if upload fails
        }
        setUploading(false);
      }

      // Prepare product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock) || 0,
        image: imagePath
      };

      // Update product
      const result = await productsAPI.updateProduct(id, productData);
      
      if (result.success) {
        toast.success("Product updated successfully!");
        navigate("/admin/products");
      } else {
        throw new Error(result.message || "Update failed");
      }

    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        setSaving(true);
        await productsAPI.deleteProduct(id);
        toast.success("Product deleted successfully");
        navigate("/admin/products");
      } catch (error) {
        toast.error("Failed to delete product");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/products")}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-indigo-600 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Edit Product</h1>
            <p className="text-gray-500 text-sm mt-1">ID: {id.toUpperCase()}</p>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-bold text-sm"
        >
          <Trash2 size={18} />
          Delete Product
        </button>
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
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Description</label>
                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product Description"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Sale Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-black"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Regular Price (₹)</label>
                <input
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Stock</label>
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
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
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-bold appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Upload size={18} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Product Media</h3>
            </div>

              <div className="relative group">
                <img
                  src={imagePreview || '/vite.svg'}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-[2rem] border border-gray-100"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-[2rem] cursor-pointer">
                  <div className="flex flex-col items-center text-white">
                    <Upload size={24} />
                    <span className="text-xs font-bold mt-2 uppercase tracking-widest">Change Image</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {saving ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  export default AdminEditProduct;