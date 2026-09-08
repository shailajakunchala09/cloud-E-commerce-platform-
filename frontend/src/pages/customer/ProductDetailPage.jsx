import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as productApi from "../../api/productApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    productApi.getProduct(id)
      .then(setProduct)
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    setAdding(true);
    setError("");
    try {
      await addItem(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loading />;
  if (!product) return <ErrorBanner message={error || "Product not found."} />;

  return (
    <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, overflow: "hidden" }}>
      <div style={{ background: "#EEF1F5", minHeight: 360 }}>
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      <div style={{ padding: 32 }}>
        {product.categoryName && (
          <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            {product.categoryName}
          </div>
        )}
        <h2 className="mb-16">{product.name}</h2>
        <p className="muted" style={{ lineHeight: 1.6, marginBottom: 20 }}>{product.description}</p>

        <div className="flex-between mb-16">
          <span className="price-tag" style={{ fontSize: 26 }}>{formatCurrency(product.price)}</span>
          {!product.inStock ? (
            <span className="badge badge-danger">Out of stock</span>
          ) : (
            <span className="badge badge-success">{product.stockQuantity} in stock</span>
          )}
        </div>

        <ErrorBanner message={error} />

        {product.inStock && (
          <div className="flex" style={{ gap: 12, alignItems: "center" }}>
            <input
              type="number"
              min="1"
              max={product.stockQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1", 10)))}
              style={{ width: 70, padding: "9px 10px", borderRadius: 8, border: "1px solid var(--border)" }}
            />
            <button className="btn btn-accent" onClick={handleAddToCart} disabled={adding}>
              {adding ? "Adding..." : added ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
