import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import * as adminApi from "../../api/adminApi";
import * as productApi from "../../api/productApi";

import ErrorBanner from "../../components/common/ErrorBanner";
import { formatCurrency } from "../../utils/formatCurrency";

/* ============================================================
   STATUS CONFIGURATION
   ============================================================ */

const STATUS_COLORS = {
  PENDING: "#f5b942",
  CONFIRMED: "#4f8cff",
  SHIPPED: "#8b5cf6",
  DELIVERED: "#2dd4a8",
  CANCELLED: "#ff647c",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

/* ============================================================
   DATA HELPERS
   ============================================================ */

function getItems(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
}

/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  icon,
  label,
  value,
  accent = "",
}) {
  return (
    <article className={`admin-stat-card ${accent}`}>
      <div className="admin-stat-top">
        <div className="admin-stat-icon">
          {icon}
        </div>

        <span className="admin-stat-trend">
          ↑ 0%
        </span>
      </div>

      <div className="admin-stat-label">
        {label}
      </div>

      <div className="admin-stat-value">
        {value}
      </div>

      <div className="admin-stat-period">
        vs. last 7 days
      </div>
    </article>
  );
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================================
     LOAD DASHBOARD DATA
     ========================================================== */

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * Load only the dashboard summary first.
         *
         * This is the important request.
         * The dashboard can open as soon as this finishes.
         */
        const summaryData =
          await adminApi.getDashboardSummary();

        if (!mounted) {
          return;
        }

        setSummary(summaryData);

        /*
         * Stop the main loading screen immediately.
         *
         * Products and orders will continue loading
         * in the background.
         */
        setLoading(false);

        /* ====================================================
           LOAD PRODUCTS IN BACKGROUND
           ==================================================== */

        productApi
          .getProducts(0, 50)
          .then((productsData) => {
            if (mounted) {
              setProducts(getItems(productsData));
            }
          })
          .catch((productError) => {
            console.warn(
              "Could not load products:",
              productError
            );
          });

        /* ====================================================
           LOAD ORDERS IN BACKGROUND
           ==================================================== */

        adminApi
          .getAllOrders(0, 10)
          .then((ordersData) => {
            if (mounted) {
              setOrders(getItems(ordersData));
            }
          })
          .catch((ordersError) => {
            console.warn(
              "Could not load orders:",
              ordersError
            );
          });

      } catch (err) {
        console.error(
          "Dashboard loading error:",
          err
        );

        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Could not load dashboard analytics."
          );

          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================================
     LOW STOCK PRODUCTS
     ========================================================== */

  const lowStockProducts = useMemo(() => {
    return products
      .filter((product) => {
        const stock = Number(
          product.stockQuantity
        );

        return stock >= 0 && stock <= 5;
      })
      .sort(
        (a, b) =>
          Number(a.stockQuantity) -
          Number(b.stockQuantity)
      )
      .slice(0, 5);
  }, [products]);

  /* ==========================================================
     LAST 7 DAYS ORDERS
     ========================================================== */

  const dailyData = useMemo(() => {
    if (!summary?.ordersLast7Days) {
      return [];
    }

    return summary.ordersLast7Days.map(
      (item) => ({
        date:
          item.date?.slice(5) ||
          item.label ||
          "",
        orders: Number(item.count || 0),
      })
    );
  }, [summary]);

  /* ==========================================================
     ORDERS BY STATUS
     ========================================================== */

  const statusData = useMemo(() => {
    const source =
      summary?.ordersByStatus || {};

    return Object.keys(STATUS_LABELS).map(
      (status) => ({
        name: STATUS_LABELS[status],
        status,
        value: Number(
          source[status] || 0
        ),
      })
    );
  }, [summary]);

  const totalOrders = Number(
    summary?.totalOrders || 0
  );

  /* ==========================================================
     DONUT DATA
     ========================================================== */

  const hasOrders = totalOrders > 0;

  const donutData = hasOrders
    ? statusData.filter(
        (item) => item.value > 0
      )
    : [];

  /* ==========================================================
     FORMAT ORDER STATUS
     ========================================================== */

  const getOrderStatusClass = (status) => {
    if (!status) {
      return "pending";
    }

    return status
      .toString()
      .toLowerCase();
  };

  /* ==========================================================
     MAIN LOADING
     ========================================================== */

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />

        <span>
          Loading dashboard...
        </span>
      </div>
    );
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error) {
    return (
      <div className="admin-error-wrapper">
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  /* ==========================================================
     DASHBOARD
     ========================================================== */

  return (
    <main className="admin-dashboard">

      {/* ======================================================
          DASHBOARD HEADER
          ====================================================== */}

      <section className="admin-dashboard-header">

        <div className="admin-dashboard-intro">

          <span className="admin-eyebrow">
            NIMBUS / ADMIN
          </span>

          <h1>
            Hello,
            <span>
              {" "}Kunchala Shailaja
            </span>
          </h1>

          <p>
            Here's what's happening with
            your store today.
          </p>

        </div>

        <div className="admin-date-badge">
          <span className="admin-date-icon">
            ◷
          </span>

          <span>
            Last 7 days
          </span>
        </div>

      </section>

      {/* ======================================================
          KPI CARDS
          ====================================================== */}

      <section className="admin-stat-grid">

        <StatCard
          icon="♟"
          label="Total Users"
          value={Number(
            summary.totalUsers || 0
          ).toLocaleString()}
          accent="blue"
        />

        <StatCard
          icon="◇"
          label="Total Products"
          value={Number(
            summary.totalProducts || 0
          ).toLocaleString()}
          accent="purple"
        />

        <StatCard
          icon="🛒"
          label="Total Orders"
          value={totalOrders.toLocaleString()}
          accent="orange"
        />

        <StatCard
          icon="₹"
          label="Revenue"
          value={formatCurrency(
            summary.totalRevenue || 0
          )}
          accent="green"
        />

        <StatCard
          icon="!"
          label="Low Stock Items"
          value={Number(
            summary.lowStockProductCount || 0
          ).toLocaleString()}
          accent="red"
        />

      </section>

      {/* ======================================================
          MAIN ANALYTICS
          ====================================================== */}

      <section className="admin-chart-grid">

        {/* ====================================================
            ORDERS LAST 7 DAYS
            ==================================================== */}

        <article className="admin-panel admin-orders-chart">

          <header className="admin-panel-header">

            <div className="admin-panel-title-group">

              <span className="admin-panel-icon purple">
                ▥
              </span>

              <div>
                <h2>
                  Orders — Last 7 Days
                </h2>

                <p>
                  Daily order activity
                </p>
              </div>

            </div>

            <span className="admin-chart-legend">
              <i />
              Orders
            </span>

          </header>

          <div className="admin-chart">

            {dailyData.length === 0 ? (

              <div className="admin-chart-empty">

                <span className="admin-chart-empty-icon">
                  ▥
                </span>

                <strong>
                  No order activity yet
                </strong>

                <p>
                  Daily orders will appear
                  here once customers start
                  placing orders.
                </p>

              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={dailyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.055)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#71809a",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#71809a",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill:
                        "rgba(124,92,255,0.05)",
                    }}
                    contentStyle={{
                      background:
                        "#101827",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius:
                        "12px",
                      color: "#ffffff",
                      boxShadow:
                        "0 16px 40px rgba(0,0,0,0.35)",
                    }}
                    labelStyle={{
                      color: "#aeb9ca",
                    }}
                  />

                  <Bar
                    dataKey="orders"
                    fill="#7c5cff"
                    radius={[
                      7,
                      7,
                      0,
                      0,
                    ]}
                    maxBarSize={42}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>

        </article>

        {/* ====================================================
            ORDER STATUS
            ==================================================== */}

        <article className="admin-panel">

          <header className="admin-panel-header">

            <div className="admin-panel-title-group">

              <span className="admin-panel-icon green">
                ◉
              </span>

              <div>
                <h2>
                  Orders by Status
                </h2>

                <p>
                  Order lifecycle
                </p>
              </div>

            </div>

          </header>

          <div className="status-chart-wrapper">

            <div className="status-donut">

              {hasOrders ? (

                <>
                  <ResponsiveContainer
                    width="100%"
                    height={230}
                  >

                    <PieChart>

                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={88}
                        paddingAngle={3}
                        stroke="none"
                      >

                        {donutData.map(
                          (entry) => (
                            <Cell
                              key={
                                entry.status
                              }
                              fill={
                                STATUS_COLORS[
                                  entry.status
                                ]
                              }
                            />
                          )
                        )}

                      </Pie>

                    </PieChart>

                  </ResponsiveContainer>

                  <div className="donut-center">

                    <strong>
                      {totalOrders}
                    </strong>

                    <span>
                      Total Orders
                    </span>

                  </div>
                </>

              ) : (

                <div className="empty-donut">

                  <div className="empty-donut-ring">

                    <strong>
                      0
                    </strong>

                    <span>
                      Total Orders
                    </span>

                  </div>

                </div>

              )}

            </div>

            <div className="status-list">

              {statusData.map(
                (item) => {

                  const percentage =
                    totalOrders > 0
                      ? Math.round(
                          (item.value /
                            totalOrders) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      className="status-row"
                      key={
                        item.status
                      }
                    >

                      <span className="status-name">

                        <i
                          style={{
                            background:
                              STATUS_COLORS[
                                item.status
                              ],
                          }}
                        />

                        {item.name}

                      </span>

                      <strong>
                        {item.value} (
                        {percentage}
                        %)
                      </strong>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </article>

      </section>

      {/* ======================================================
          LOWER CONTENT
          ====================================================== */}

      <section className="admin-lower-grid">

        {/* ====================================================
            LOW STOCK
            ==================================================== */}

        <article className="admin-panel">

          <header className="admin-panel-header">

            <div className="admin-panel-title-group">

              <span className="admin-panel-icon red">
                !
              </span>

              <div>
                <h2>
                  Low Stock Inventory Alerts
                </h2>

                <p>
                  Products that need attention
                </p>
              </div>

            </div>

            <Link to="/admin/products">
              View All
            </Link>

          </header>

          <div className="admin-table-wrapper">

            {lowStockProducts.length ===
            0 ? (

              <div className="admin-empty">

                <span className="admin-empty-icon success">
                  ✓
                </span>

                <strong>
                  Inventory looks healthy
                </strong>

                <p>
                  No products are currently
                  low on stock.
                </p>

              </div>

            ) : (

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Product
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {lowStockProducts.map(
                    (product) => {

                      const stock =
                        Number(
                          product.stockQuantity
                        );

                      return (
                        <tr
                          key={
                            product.id
                          }
                        >

                          <td>

                            <div className="admin-product-cell">

                              {product.imageUrl ? (

                                <img
                                  src={
                                    product.imageUrl
                                  }
                                  alt={
                                    product.name
                                  }
                                />

                              ) : (

                                <div className="admin-product-placeholder">
                                  ◇
                                </div>

                              )}

                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                            </div>

                          </td>

                          <td>
                            {
                              product.categoryName ||
                              "—"
                            }
                          </td>

                          <td>
                            {formatCurrency(
                              product.price
                            )}
                          </td>

                          <td>
                            <strong className="stock-danger">
                              {stock}
                            </strong>
                          </td>

                          <td>

                            <span className="stock-badge">
                              Low Stock
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </article>

        {/* ====================================================
            RECENT ORDERS
            ==================================================== */}

        <article className="admin-panel">

          <header className="admin-panel-header">

            <div className="admin-panel-title-group">

              <span className="admin-panel-icon cyan">
                🛒
              </span>

              <div>
                <h2>
                  Recent Orders
                </h2>

                <p>
                  Latest customer activity
                </p>
              </div>

            </div>

            <Link to="/admin/orders">
              View All
            </Link>

          </header>

          {orders.length === 0 ? (

            <div className="admin-empty">

              <div className="admin-empty-icon">
                ◇
              </div>

              <strong>
                No orders yet
              </strong>

              <p>
                Orders will appear here once
                customers make purchases.
              </p>

            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Order ID
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders
                    .slice(0, 5)
                    .map((order) => {

                      const status =
                        order.status ||
                        "PENDING";

                      return (
                        <tr
                          key={
                            order.id
                          }
                        >

                          <td>
                            <strong>
                              #{order.id}
                            </strong>
                          </td>

                          <td>
                            {
                              order.user
                                ?.fullName ||
                              order.customerName ||
                              order.user
                                ?.email ||
                              "Customer"
                            }
                          </td>

                          <td>

                            <span
                              className={`order-status ${getOrderStatusClass(
                                status
                              )}`}
                            >
                              {
                                STATUS_LABELS[
                                  status
                                ] ||
                                status
                              }
                            </span>

                          </td>

                          <td>
                            {formatCurrency(
                              order.totalAmount ||
                                order.total ||
                                0
                            )}
                          </td>

                        </tr>
                      );
                    })}

                </tbody>

              </table>

            </div>

          )}

        </article>

      </section>

      {/* ======================================================
          QUICK ACTIONS
          ====================================================== */}

      <section className="admin-quick-actions">

        <Link
          to="/admin/products"
          className="admin-action-card"
        >

          <span className="admin-action-icon purple">
            ◇
          </span>

          <div>

            <strong>
              Manage Products
            </strong>

            <small>
              Add, edit and manage inventory
            </small>

          </div>

          <b>
            →
          </b>

        </Link>

        <Link
          to="/admin/orders"
          className="admin-action-card"
        >

          <span className="admin-action-icon cyan">
            🛒
          </span>

          <div>

            <strong>
              Manage Orders
            </strong>

            <small>
              Review and update customer orders
            </small>

          </div>

          <b>
            →
          </b>

        </Link>

      </section>

    </main>
  );
}