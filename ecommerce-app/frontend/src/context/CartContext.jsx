import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'guest_cart';

// Guest cart shape kept simple: [{ product: {...}, quantity }]
function readGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
}
function writeGuestCart(cart) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    setLoading(true);
    if (user) {
      // Logged in: cart is persisted server-side and follows the account
      const res = await api.get('/cart');
      setCart(res.data);
    } else {
      setCart(readGuestCart());
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  async function addToCart(product, quantity = 1) {
    if (user) {
      const res = await api.post('/cart', { productId: product._id, quantity });
      setCart(res.data);
    } else {
      const existing = readGuestCart();
      const idx = existing.findIndex((i) => i.product._id === product._id);
      if (idx >= 0) existing[idx].quantity += quantity;
      else existing.push({ product, quantity });
      writeGuestCart(existing);
      setCart(existing);
    }
  }

  async function updateQuantity(productId, quantity) {
    if (user) {
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data);
    } else {
      const existing = readGuestCart().map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      );
      writeGuestCart(existing);
      setCart(existing);
    }
  }

  async function removeFromCart(productId) {
    if (user) {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data);
    } else {
      const existing = readGuestCart().filter((i) => i.product._id !== productId);
      writeGuestCart(existing);
      setCart(existing);
    }
  }

  async function clearCart() {
    if (user) {
      await api.delete('/cart');
    } else {
      writeGuestCart([]);
    }
    setCart([]);
  }

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, subtotal, reloadCart: loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
