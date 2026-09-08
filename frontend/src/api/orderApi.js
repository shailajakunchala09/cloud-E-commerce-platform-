import apiClient from "./apiClient";

export const placeOrder = (shippingAddress) =>
  apiClient.post("/orders", { shippingAddress }).then((res) => res.data);

export const getMyOrders = (page = 0, size = 10) =>
  apiClient.get(`/orders?page=${page}&size=${size}`).then((res) => res.data);

export const getOrder = (id) => apiClient.get(`/orders/${id}`).then((res) => res.data);
