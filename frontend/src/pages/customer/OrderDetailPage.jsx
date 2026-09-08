import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import * as orderApi from "../../api/orderApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { statusBadgeClass } from "../../utils/orderStatusBadge";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/ErrorBanner";

const TRACKING_STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    orderApi.getOrder(id).then(setOrder).catch(() => setError("Order not found."));
  }, [id]);

  if (error) return <ErrorBanner message={error} />;
  if (!order) return <Loading />;

  const currentStep = TRACKING_STEPS.indexOf(order.status);
  const cancelled = order.status === "CANCELLED";

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {location.state?.justPlaced && (
        <div className="card" style={{ background: "var(--success-bg)", color: "var(--success)", padding: "12px 16px", marginBottom: 16, fontSize: 14 }}>
          Order placed successfully!
        </div>
      )}

      <div className="flex-between mb-16">
        <h2>Order #{order.orderId}</h2>
        <span className={statusBadgeClass(order.status)}>{order.status}</span>
      </div>

      {!cancelled && (
        <div className="card mb-16" style={{ padding: 24 }}>
          <div className="flex-between">
            {TRACKING_STEPS.map((step, idx) => (
              <div key={step} className="text-center" style={{ flex: 1 }}>
                <div
                  style={{
                    width: 12, height: 12, borderRadius: "50%", margin: "0 auto 8px",
                    background: idx <= currentStep ? "var(--success)" : "var(--border)",
                  }}
                />
                <div className="muted" style={{ fontSize: 11, textTransform: "uppercase" }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 24 }}>
        <div className="muted mb-16" style={{ fontSize: 13 }}>
          Placed on {new Date(order.createdAt).toLocaleString()} · Ships to {order.shippingAddress}
        </div>
        {order.items.map((item) => (
          <div key={item.productId} className="flex-between" style={{ padding: "8px 0", fontSize: 14 }}>
            <span>{item.productName} × {item.quantity}</span>
            <span className="price">{formatCurrency(item.lineTotal)}</span>
          </div>
        ))}
        <div className="flex-between mt-24" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <strong>Total</strong>
          <span className="price" style={{ fontSize: 18 }}>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
