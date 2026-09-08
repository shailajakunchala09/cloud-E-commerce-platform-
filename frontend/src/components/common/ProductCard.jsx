import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ProductCard({ product }) {
  const lowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

  return (
    <Link to={`/products/${product.id}`} className="card" style={{ overflow: "hidden", display: "block", color: "inherit" }}>
      <div style={{ aspectRatio: "4 / 3", background: "#EEF1F5", overflow: "hidden" }}>
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      <div style={{ padding: 16 }}>
        {product.categoryName && (
          <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
            {product.categoryName}
          </div>
        )}
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, lineHeight: 1.3 }}>{product.name}</div>
        <div className="flex-between">
          <span className="price-tag" style={{ fontSize: 17 }}>{formatCurrency(product.price)}</span>
          {!product.inStock ? (
            <span className="badge badge-danger">Out of stock</span>
          ) : lowStock ? (
            <span className="badge badge-warning">Low stock</span>
          ) : (
            <span className="badge badge-success">In stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
