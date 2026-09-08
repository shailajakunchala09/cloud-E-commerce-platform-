import React, { useEffect, useState } from "react";
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
  Legend,
} from "recharts";
import * as adminApi from "../../api/adminApi";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/ErrorBanner";
import { formatCurrency } from "../../utils/formatCurrency";

const STATUS_COLORS = {
  PENDING: "#E0A32E",
  CONFIRMED: "#2454FF",
  SHIPPED: "#6C4CD8",
  DELIVERED: "#1F9D6C",
  CANCELLED: "#D64545",
};

function Kpi({ label, value, accent }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={accent ? { color: "var(--accent)" } : undefined}>
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getDashboardSummary()
      .then(setSummary)
      .catch(() => setError("Could not load dashboard analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorBanner message={error} />;
  if (!summary) return null;

  const statusData = Object.entries(summary.ordersByStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ name: status, value: count }));

  const dailyData = summary.ordersLast7Days.map((d) => ({ date: d.date.slice(5), orders: d.count }));

  return (
    <div>
      <div className="flex-between mb-16">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 4 }}>Admin Dashboard</h1>
          <p className="muted">Store performance at a glance</p>
        </div>
        <div className="flex" style={{ gap: 10 }}>
          <Link to="/admin/products" className="btn btn-outline">Manage Products</Link>
          <Link to="/admin/orders" className="btn btn-primary">Manage Orders</Link>
        </div>
      </div>

      <div className="grid mb-24" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <Kpi label="Total Users" value={summary.totalUsers.toLocaleString()} />
        <Kpi label="Total Products" value={summary.totalProducts.toLocaleString()} />
        <Kpi label="Total Orders" value={summary.totalOrders.toLocaleString()} />
        <Kpi label="Revenue" value={formatCurrency(summary.totalRevenue)} accent />
        <Kpi label="Low Stock Items" value={summary.lowStockProductCount.toLocaleString()} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Orders — last 7 days</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="orders" fill="var(--brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#8FA0BD"} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
