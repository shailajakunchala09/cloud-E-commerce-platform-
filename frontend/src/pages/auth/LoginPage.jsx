import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const data = await login(
        form.email,
        form.password
      );

      if (data.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check your email and password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="nimbus-login-page">
      <div className="nimbus-login-shell">

        {/* BRAND */}
        <div className="nimbus-login-brand">
          <span className="nimbus-brand-mark">N</span>

          <div>
            <div className="nimbus-brand-name">
              NIMBUS
            </div>

            <div className="nimbus-brand-subtitle">
              COMMERCE
            </div>
          </div>
        </div>

        {/* LEFT / BRAND MESSAGE */}
        <section className="nimbus-login-intro">
          <div className="nimbus-intro-number">
            01
          </div>

          <p className="nimbus-intro-kicker">
            THE NIMBUS STANDARD
          </p>

          <h1>
            Better things.
            <br />
            <span>Better choices.</span>
          </h1>

          <p className="nimbus-intro-text">
            Discover a carefully selected collection
            of premium essentials designed for modern
            living.
          </p>

          <div className="nimbus-intro-line" />

          <div className="nimbus-intro-meta">
            <span>CURATED COLLECTION</span>
            <span>EST. 2026</span>
          </div>
        </section>

        {/* LOGIN */}
        <section className="nimbus-login-panel">

          <div className="nimbus-login-heading">
            <p>WELCOME BACK</p>

            <h2>
              Sign in
            </h2>

            <span>
              Continue to your NIMBUS account.
            </span>
          </div>

          {error && (
            <ErrorBanner message={error} />
          )}

          <form
            className="nimbus-login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}
            <div className="nimbus-login-field">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div className="nimbus-login-field">
              <div className="nimbus-password-label">
                <label htmlFor="password">
                  Password
                </label>

                <span>
                  SECURE ACCESS
                </span>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="nimbus-login-button"
              disabled={submitting}
            >
              <span>
                {submitting
                  ? "Signing in..."
                  : "Enter NIMBUS"}
              </span>

              <span className="nimbus-login-arrow">
                →
              </span>
            </button>
          </form>

          {/* REGISTER */}
          <div className="nimbus-login-register">
            <span>
              New to NIMBUS?
            </span>

            <Link to="/register">
              Create an account
              <span>↗</span>
            </Link>
          </div>

          <div className="nimbus-login-footer">
            <span>PRIVATE · SECURE · CURATED</span>
          </div>

        </section>
      </div>
    </main>
  );
}