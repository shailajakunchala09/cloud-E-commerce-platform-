import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="premium-navbar">
      <div className="premium-navbar-inner">

        {/* BRAND */}
        <Link to="/" className="premium-brand">
          <span className="premium-brand-main">Nimbus</span>
          <span className="premium-brand-sub">/commerce</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="premium-nav">

          <Link to="/" className="premium-nav-link active">
            Shop
          </Link>

          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/orders" className="premium-nav-link">
                Orders
              </Link>

              <Link to="/cart" className="premium-cart-link">
                <span>Cart</span>

                {itemCount > 0 && (
                  <span className="premium-cart-count">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="premium-nav-link">
              Admin
            </Link>
          )}

          <span className="premium-nav-divider" />

          {isAuthenticated ? (
            <div className="premium-user-area">

              <Link to="/profile" className="premium-profile">
                <span className="premium-avatar">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>

                <span className="premium-user-name">
                  {user?.fullName || "Account"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="premium-login-button"
              >
                Log out
              </button>

            </div>
          ) : (
            <div className="premium-auth-area">

              <Link
                to="/login"
                className="premium-login-button"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="premium-signup-button"
              >
                Create account
              </Link>

            </div>
          )}

        </nav>
      </div>
    </header>
  );
}