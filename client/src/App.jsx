import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import About from "./pages/About";
import ProductDetails from "./pages/ProductDetails";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminEditProduct from "./pages/AdminEditProduct";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } />
            <Route path="/order/:id" element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<About />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }>
              <Route index element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-800">Welcome to Admin Dashboard</h2>
                  <p className="text-gray-500 mt-2">Select an option from the sidebar to get started</p>
                </div>
              } />
              <Route path="products" element={<AdminProducts />} />
              <Route path="add-product" element={<AdminAddProduct />} />
              <Route path="edit-product/:id" element={<AdminEditProduct />} />
            </Route>
            
            {/* Legacy admin route - redirect to new dashboard */}
            <Route path="/admin/add-product" element={
              <AdminRoute>
                <AdminAddProduct />
              </AdminRoute>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;