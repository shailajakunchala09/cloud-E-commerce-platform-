import apiClient from "./apiClient";

export const getCart = () => apiClient.get("/cart").then((res) => res.data);

export const addToCart = (productId, quantity) =>
  apiClient.post("/cart/items", { productId, quantity }).then((res) => res.data);

export const updateCartItem = (cartItemId, quantity) =>
  apiClient.put(`/cart/items/${cartItemId}?quantity=${quantity}`).then((res) => res.data);

export const removeCartItem = (cartItemId) => apiClient.delete(`/cart/items/${cartItemId}`);

export const clearCart = () => apiClient.delete("/cart");
