import { useState } from "react";
import toast from "react-hot-toast";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

function AdminAddProduct() {
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
    setImage(file);
    setPreview(URL.createObjectURL(file));
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

      const result = await res.json();

      if (result.success) {
        toast.success("Product added successfully");

        setForm({
          name: "",
          price: "",
          category: "Resin Art",
          stock: "",
          description: "",
        });

        setImage(null);
        setPreview(null);
      } else {
        toast.error(result.message || "Failed to add product");
      }
    } catch (err) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-3 rounded mb-4"
          required
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-3 rounded mb-4"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        >
          <option>Resin Art</option>
          <option>Resin Trays</option>
          <option>Jewelry</option>
          <option>Home Decor</option>
          <option>Accessories</option>
        </select>

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border p-3 rounded mb-4"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full border p-3 rounded mb-4"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded mb-4"
          />
        )}

        <button
          disabled={loading}
          className="w-full bg-pink-500 text-white p-3 rounded font-semibold"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AdminAddProduct;