import apiClient from "./apiClient";

export const getDashboardSummary = () => apiClient.get("/admin/dashboard/summary").then((res) => res.data);

export const getAllOrders = (page = 0, size = 10) =>
  apiClient.get(`/admin/orders?page=${page}&size=${size}`).then((res) => res.data);

export const updateOrderStatus = (orderId, status) =>
  apiClient.patch(`/admin/orders/${orderId}/status`, { status }).then((res) => res.data);

export const getAuditLogs = (page = 0, size = 20) =>
  apiClient.get(`/admin/audit-logs?page=${page}&size=${size}`).then((res) => res.data);
