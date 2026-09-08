import apiClient from "./apiClient";

export const getProducts = (page = 0, size = 12) =>
  apiClient.get(`/products?page=${page}&size=${size}`).then((res) => res.data);

export const searchProducts = (keyword, page = 0, size = 12) =>
  apiClient.get(`/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`).then((res) => res.data);

export const getProductsByCategory = (categoryId, page = 0, size = 12) =>
  apiClient.get(`/products/category/${categoryId}?page=${page}&size=${size}`).then((res) => res.data);

export const getProduct = (id) => apiClient.get(`/products/${id}`).then((res) => res.data);

export const createProduct = (payload) => apiClient.post("/products", payload).then((res) => res.data);

export const updateProduct = (id, payload) => apiClient.put(`/products/${id}`, payload).then((res) => res.data);

export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

export const getCategories = () => apiClient.get("/categories").then((res) => res.data);
