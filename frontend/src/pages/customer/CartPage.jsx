import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function CartPage() {
  const { cart, refreshCart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshCart().catch(() => setError("Could not load your cart.")).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuantityChange = async (cartItemId, quantity) => {
    try {
      await updateItem(cartItemId, quantity);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update quantity.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h2 className="mb-16">Your cart</h2>
      <ErrorBanner message={error} />

      {(!cart.items || cart.items.length === 0) ? (
        <div className="card text-center" style={{ padding: 48 }}>
          <p className="muted mb-16">Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">Browse products</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          <div className="card">
            {cart.items.map((item, idx) => (
              <div
                key={item.cartItemId}
                className="flex-between"
                style={{ padding: 18, borderBottom: idx < cart.items.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.productName}</div>
                  <div className="muted price" style={{ fontSize: 13 }}>{formatCurrency(item.unitPrice)} each</div>
                </div>
                <div className="flex" style={{ gap: 16, alignItems: "center" }}>
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.cartItemId, parseInt(e.target.value || "0", 10))}
                    style={{ width: 60, padding: "7px 8px", borderRadius: 8, border: "1px solid var(--border)" }}
                  />
                  <span className="price" style={{ width: 80, textAlign: "right" }}>{formatCurrency(item.lineTotal)}</span>
                  <button className="btn btn-danger" onClick={() => removeItem(item.cartItemId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div className="flex-between mb-16">
              <span className="muted">Subtotal</span>
              <span className="price" style={{ fontSize: 20 }}>{formatCurrency(cart.subtotal)}</span>
            </div>
            <button className="btn btn-accent" style={{ width: "100%" }} onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
