import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as orderApi from "../../api/orderApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { statusBadgeClass } from "../../utils/orderStatusBadge";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    orderApi.getMyOrders()
      .then((data) => setOrders(data.content))
      .catch(() => setError("Could not load your orders."));
  }, []);

  if (error) return <ErrorBanner message={error} />;
  if (orders === null) return <Loading />;

  return (
    <div>
      <h2 className="mb-16">My orders</h2>
      {orders.length === 0 ? (
        <p className="muted">You haven't placed any orders yet.</p>
      ) : (
        <div className="card">
          {orders.map((order, idx) => (
            <Link
              key={order.orderId}
              to={`/orders/${order.orderId}`}
              className="flex-between"
              style={{
                padding: 18,
                borderBottom: idx < orders.length - 1 ? "1px solid var(--border)" : "none",
                color: "inherit",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Order #{order.orderId}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                </div>
              </div>
              <div className="flex" style={{ gap: 16, alignItems: "center" }}>
                <span className={statusBadgeClass(order.status)}>{order.status}</span>
                <span className="price">{formatCurrency(order.totalAmount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
