import React, { createContext, useContext, useState, useCallback } from "react";
import * as cartApi from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    const data = await cartApi.getCart();
    setCart(data);
  }, [isAuthenticated]);

  const addItem = useCallback(async (productId, quantity) => {
    const data = await cartApi.addToCart(productId, quantity);
    setCart(data);
  }, []);

  const updateItem = useCallback(async (cartItemId, quantity) => {
    const data = await cartApi.updateCartItem(cartItemId, quantity);
    setCart(data);
  }, []);

  const removeItem = useCallback(async (cartItemId) => {
    await cartApi.removeCartItem(cartItemId);
    await refreshCart();
  }, [refreshCart]);

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, refreshCart, addItem, updateItem, removeItem, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
