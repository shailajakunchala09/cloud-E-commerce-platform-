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
    <header style={{ background: "var(--ink)", borderBottom: "1px solid var(--border)" }}>
      <div className="container flex-between" style={{ height: 64 }}>
        <Link to="/" style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "#fff" }}>
            Nimbus
          </span>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--accent)" }}>
            /commerce
          </span>
        </Link>

        <nav className="flex" style={{ gap: 22, alignItems: "center" }}>
          <Link to="/" style={{ color: "#DCE3F0", fontSize: 14, fontWeight: 500 }}>
            Catalog
          </Link>

          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/orders" style={{ color: "#DCE3F0", fontSize: 14, fontWeight: 500 }}>
                My Orders
              </Link>
              <Link to="/cart" style={{ color: "#DCE3F0", fontSize: 14, fontWeight: 500, position: "relative" }}>
                Cart
                {itemCount > 0 && (
                  <span
                    style={{
                      marginLeft: 6,
                      background: "var(--accent)",
                      color: "#fff",
                      borderRadius: 999,
                      fontSize: 11,
                      fontFamily: "var(--font-data)",
                      padding: "1px 7px",
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" style={{ color: "#DCE3F0", fontSize: 14, fontWeight: 500 }}>
              Admin Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex" style={{ gap: 12, alignItems: "center" }}>
              <Link to="/profile" style={{ color: "#8FA0BD", fontSize: 13 }}>
                {user.fullName}
              </Link>
              <button className="btn btn-outline" style={{ borderColor: "#2C3B54", color: "#DCE3F0" }} onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="flex" style={{ gap: 10 }}>
              <Link to="/login" className="btn btn-outline" style={{ borderColor: "#2C3B54", color: "#DCE3F0" }}>
                Log in
              </Link>
              <Link to="/register" className="btn btn-accent">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
