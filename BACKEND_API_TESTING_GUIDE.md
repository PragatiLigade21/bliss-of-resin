# Backend API Testing Guide

## Server Setup

### Starting the Server
```bash
cd server
npm start
```

Server runs on: `http://localhost:5000`

---

## 📚 API ENDPOINTS

### PRODUCTS API

#### 1. Get All Products (with filters)
**Endpoint:** `GET /api/products`

**Query Parameters:**
```
- keyword: string (search by name/description)
- category: string (filter by category)
- minPrice: number
- maxPrice: number
- rating: number (minimum rating)
- sort: string (newest, price-low, price-high, rating, best-selling)
- page: number
- limit: number
- inStock: boolean
```

**Example Request:**
```bash
curl "http://localhost:5000/api/products?keyword=resin&category=Jewelry&sort=price-low&page=1&limit=12"
```

**Response:**
```json
{
  "success": true,
  "products": [...],
  "page": 1,
  "pages": 5,
  "total": 50,
  "hasMore": true
}
```

---

#### 2. Get Product Categories
**Endpoint:** `GET /api/products/categories`

**Response:**
```json
{
  "success": true,
  "categories": ["Resin Art", "Jewelry", "Home Decor", ...]
}
```

---

#### 3. Get Single Product
**Endpoint:** `GET /api/products/product/:id`

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "...",
    "price": 499,
    "rating": 4.5,
    "reviews": [...],
    "viewCount": 150,
    ...
  }
}
```

---

#### 4. Get Related Products
**Endpoint:** `GET /api/products/related/:id`

**Response:**
```json
{
  "success": true,
  "products": [...]
}
```

---

#### 5. Create Product (ADMIN ONLY)
**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Beautiful Resin Art",
  "price": 999,
  "originalPrice": 1299,
  "image": "path/to/image.jpg",
  "category": "Resin Art",
  "description": "...",
  "stock": 50,
  "sku": "PROD-001",
  "tags": ["handmade", "resin"]
}
```

---

#### 6. Update Product (ADMIN ONLY)
**Endpoint:** `PUT /api/products/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

#### 7. Delete Product (ADMIN ONLY)
**Endpoint:** `DELETE /api/products/:id`

**Headers:**
```
Authorization: Bearer {token}
```

---

### REVIEWS API

#### 1. Get Product Reviews
**Endpoint:** `GET /api/reviews/product/:productId`

**Query Parameters:**
```
- page: number (default: 1)
- limit: number (default: 5)
- sort: string (recent, helpful, rating)
```

**Response:**
```json
{
  "success": true,
  "reviews": [...],
  "total": 25,
  "ratingDistribution": [...]
}
```

---

#### 2. Add Review
**Endpoint:** `POST /api/reviews`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "productId": "...",
  "rating": 5,
  "title": "Amazing Product!",
  "comment": "This resin art is absolutely beautiful..."
}
```

---

#### 3. Delete Review
**Endpoint:** `DELETE /api/reviews/:reviewId`

**Headers:**
```
Authorization: Bearer {token}
```

---

#### 4. Mark Review Helpful
**Endpoint:** `POST /api/reviews/:reviewId/helpful`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "helpful": true
}
```

---

#### 5. Approve/Reject Review (ADMIN)
**Endpoint:** `PUT /api/reviews/:reviewId/status`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "status": "approved"
}
```

---

### WISHLIST API

#### 1. Get Wishlist
**Endpoint:** `GET /api/wishlist`

**Headers:**
```
Authorization: Bearer {token}
```

---

#### 2. Add to Wishlist
**Endpoint:** `POST /api/wishlist/add/:productId`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "notes": "Optional notes about this product"
}
```

---

#### 3. Remove from Wishlist
**Endpoint:** `DELETE /api/wishlist/remove/:productId`

**Headers:**
```
Authorization: Bearer {token}
```

---

#### 4. Check if in Wishlist
**Endpoint:** `GET /api/wishlist/check/:productId`

**Headers:**
```
Authorization: Bearer {token}
```

---

### ADMIN API

#### 1. Dashboard Statistics
**Endpoint:** `GET /api/admin/dashboard/stats`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 100,
    "totalProducts": 50,
    "totalOrders": 500,
    "totalRevenue": 50000,
    "orderStats": {
      "pending": 10,
      "shipped": 20,
      "delivered": 470
    },
    "recentOrders": [...],
    "topProducts": [...]
  }
}
```

---

#### 2. Get All Orders
**Endpoint:** `GET /api/admin/orders`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
- page: number
- limit: number
- status: string (pending, confirmed, shipped, delivered)
- sort: string (newest, oldest, highest, lowest)
```

---

#### 3. Update Order Status
**Endpoint:** `PUT /api/admin/orders/:orderId/status`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA10123456784",
  "shippingCompany": "FedEx"
}
```

---

#### 4. Update Payment Status
**Endpoint:** `PUT /api/admin/orders/:orderId/payment`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "isPaid": true
}
```

---

#### 5. Get All Users
**Endpoint:** `GET /api/admin/users`

**Headers:**
```
Authorization: Bearer {token}
```

---

#### 6. Update User Role
**Endpoint:** `PUT /api/admin/users/:userId/role`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "isAdmin": true
}
```

---

#### 7. Get Products (Admin View)
**Endpoint:** `GET /api/admin/products`

**Headers:**
```
Authorization: Bearer {token}
```

---

### ORDERS API

#### 1. Create Order
**Endpoint:** `POST /api/orders`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "orderItems": [
    {
      "product": "...",
      "name": "...",
      "quantity": 2,
      "price": 499,
      "image": "..."
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "Mumbai",
    "phone": "9876543210"
  },
  "paymentMethod": "COD",
  "totalPrice": 1000
}
```

---

#### 2. Get User Orders
**Endpoint:** `GET /api/orders/my-orders`

**Headers:**
```
Authorization: Bearer {token}
```

---

#### 3. Get Order Details
**Endpoint:** `GET /api/orders/:orderId`

**Headers:**
```
Authorization: Bearer {token}
```

---

### USER ROUTES (Existing)

#### 1. Register
**Endpoint:** `POST /api/users/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

#### 2. Login
**Endpoint:** `POST /api/users/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {...}
}
```

---

## 🧪 TESTING WITH POSTMAN

### Setup
1. Import collection from `server/postman_collection.json` (create if needed)
2. Set environment variable: `token` (from login response)
3. Set `baseUrl` = `http://localhost:5000`

### Test Flow
```
1. Register new user
2. Login and save token
3. Get products
4. Get single product
5. Add review (authenticated)
6. Add to wishlist (authenticated)
7. Create order (authenticated)
8. Admin: Get dashboard stats (as admin user)
9. Admin: Update order status
```

---

## 🔒 AUTHENTICATION

### Get JWT Token
1. Register/Login to get token
2. Include in headers: `Authorization: Bearer {token}`
3. Token stored in localStorage on frontend

### Check Admin Status
- User must have `isAdmin: true` in database
- Promote user via: `PUT /api/admin/users/:userId/role`

---

## 📊 DATABASE QUERIES

### MongoDB Connection
```bash
# Check connection in server logs
# Should see: "✅ MongoDB Connected"
```

### Database Collections
- `users` - User accounts
- `products` - Product catalog
- `orders` - Customer orders
- `reviews` - Product reviews
- `wishlists` - User wishlists

---

## 🐛 COMMON ERRORS & FIXES

### Error: "Product not found"
- Check if product `_id` is valid
- Ensure product exists in database

### Error: "Authentication required"
- Ensure token is in Authorization header
- Token format: `Bearer {token}`
- Check if token is expired

### Error: "Admin access required"
- User must be promoted to admin
- Check user document `isAdmin` field

### Error: "Cannot find module"
- Ensure all route files exist
- Check import paths in server.js

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] All models deployed to MongoDB
- [ ] All routes tested and working
- [ ] Authentication working
- [ ] Admin routes protected
- [ ] Error handling implemented
- [ ] CORS configured correctly
- [ ] Environment variables set (.env file)
- [ ] Image serving working
- [ ] API documentation complete

---

## 📝 ENVIRONMENT VARIABLES (.env)

```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/bliss-resin
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 🔗 USEFUL LINKS

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Postman: https://www.postman.com
- JWT Debugger: https://jwt.io
- API Testing: https://httpbin.org

---
