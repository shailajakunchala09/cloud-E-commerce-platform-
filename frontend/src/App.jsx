import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import ProductCatalogPage from "./pages/customer/ProductCatalogPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderHistoryPage from "./pages/customer/OrderHistoryPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import ProfilePage from "./pages/customer/ProfilePage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>

              {/* =========================
                  AUTHENTICATION
              ========================= */}

              <Route
                path="/login"
                element={<LoginPage />}
              />

              <Route
                path="/register"
                element={<RegisterPage />}
              />


              {/* =========================
                  CUSTOMER PRODUCT STORE
              ========================= */}

              <Route
                path="/products"
                element={<ProductCatalogPage />}
              />

              <Route
                path="/"
                element={<Navigate to="/login" replace />}
              />

              <Route
                path="/products/:id"
                element={<ProductDetailPage />}
              />


              {/* =========================
                  CUSTOMER - AUTHENTICATED
              ========================= */}

              <Route element={<ProtectedRoute />}>

                <Route
                  path="/cart"
                  element={<CartPage />}
                />

                <Route
                  path="/checkout"
                  element={<CheckoutPage />}
                />

                <Route
                  path="/orders"
                  element={<OrderHistoryPage />}
                />

                <Route
                  path="/orders/:id"
                  element={<OrderDetailPage />}
                />

                <Route
                  path="/profile"
                  element={<ProfilePage />}
                />

              </Route>


              {/* =========================
                  ADMIN - ADMIN ONLY
              ========================= */}

              <Route element={<AdminRoute />}>

                <Route
                  path="/admin"
                  element={<AdminDashboardPage />}
                />

                <Route
                  path="/admin/products"
                  element={<AdminProductsPage />}
                />

                <Route
                  path="/admin/orders"
                  element={<AdminOrdersPage />}
                />

              </Route>

            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}