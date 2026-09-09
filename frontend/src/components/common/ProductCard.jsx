import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ProductCard({ product }) {
  const lowStock =
    product.stockQuantity > 0 &&
    product.stockQuantity <= 10;

  return (
    <Link
      to={`/products/${product.id}`}
      className="premium-product-card"
    >
      {/* IMAGE */}
      <div className="premium-product-image">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="premium-product-img"
          />
        ) : (
          <div className="premium-image-placeholder">
            <span>PRODUCT</span>
          </div>
        )}

        {/* TOP BADGE */}
        {lowStock && product.inStock && (
          <span className="premium-stock-badge">
            LOW STOCK
          </span>
        )}

        {!product.inStock && (
          <span className="premium-sold-badge">
            SOLD OUT
          </span>
        )}

        {/* VIEW BUTTON */}
        <div className="premium-view-button">
          <span>View product</span>
          <span>↗</span>
        </div>
      </div>

      {/* DETAILS */}
      <div className="premium-product-info">

        {product.categoryName && (
          <div className="premium-product-category">
            {product.categoryName}
          </div>
        )}

        <h3 className="premium-product-title">
          {product.name}
        </h3>

        {product.description && (
          <p className="premium-product-description">
            {product.description}
          </p>
        )}

        <div className="premium-product-footer">
          <div className="premium-product-price">
            {formatCurrency(product.price)}
          </div>

          <div
            className={`premium-stock-status ${
              !product.inStock
                ? "sold"
                : lowStock
                ? "low"
                : "available"
            }`}
          >
            <span className="status-dot" />

            {product.inStock
              ? lowStock
                ? `${product.stockQuantity} left`
                : "Available"
              : "Unavailable"}
          </div>
        </div>
      </div>
    </Link>
  );
}