import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import * as orderApi from "../../api/orderApi";
import { formatCurrency } from "../../utils/formatCurrency";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const order = await orderApi.placeOrder(address);
      setCart({ items: [], subtotal: 0 });
      navigate(`/orders/${order.orderId}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return <p className="muted text-center" style={{ padding: 48 }}>Your cart is empty — nothing to check out.</p>;
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h2 className="mb-16">Checkout</h2>
      <ErrorBanner message={error} />
      <div className="card" style={{ padding: 24 }}>
        <div className="mb-16">
          {cart.items.map((item) => (
            <div key={item.cartItemId} className="flex-between" style={{ padding: "8px 0", fontSize: 14 }}>
              <span>{item.productName} × {item.quantity}</span>
              <span className="price">{formatCurrency(item.lineTotal)}</span>
            </div>
          ))}
          <div className="flex-between mt-24" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <strong>Total</strong>
            <span className="price" style={{ fontSize: 18 }}>{formatCurrency(cart.subtotal)}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="field">
            <label>Shipping address</label>
            <textarea
              required
              rows={3}
              defaultValue={user?.address || ""}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, state, ZIP"
            />
          </div>
          <button className="btn btn-accent" style={{ width: "100%" }} disabled={placing}>
            {placing ? "Placing order..." : `Place order — ${formatCurrency(cart.subtotal)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
