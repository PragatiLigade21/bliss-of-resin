import { createContext, useContext, useReducer, useEffect } from "react";
import { showInfo, showSuccess } from "../utils/toast";

// Cart Actions
export const CART_ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_QTY: "UPDATE_QTY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { product } = action.payload;
      const existingItem = state.find((item) => item._id === product._id);

      if (existingItem) {
        // Increase quantity if item exists
        showInfo("Quantity updated!");
        return state.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        showInfo("Added to cart!");
        return [...state, { ...product, quantity: 1 }];
      }
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const { productId } = action.payload;
      showSuccess("Item removed from cart");
      return state.filter((item) => item._id !== productId);
    }

    case CART_ACTIONS.UPDATE_QTY: {
      const { productId, quantity } = action.payload;

      if (quantity < 1) {
        // Remove item if quantity is 0
        return state.filter((item) => item._id !== productId);
      }

      return state.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
    }

    case CART_ACTIONS.CLEAR_CART: {
      return [];
    }

    case CART_ACTIONS.LOAD_CART: {
      return action.payload || [];
    }

    default:
      return state;
  }
};

// Context
export const CartContext = createContext();

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Provider Component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log("Cart state updated:", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Action Creators
  const addToCart = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: { product } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: { productId } });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QTY, payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Computed Values
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  };

  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cart.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};