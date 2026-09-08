import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phoneNumber: "", address: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const details = err.response?.data?.details;
      setError(details?.join(" ") || err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 460, margin: "40px auto" }}>
      <h2 className="mb-16">Create your account</h2>
      <div className="card" style={{ padding: 28 }}>
        <ErrorBanner message={error} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input required value={form.fullName} onChange={handleChange("fullName")} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={handleChange("email")} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={form.password} onChange={handleChange("password")} />
            <span className="muted" style={{ fontSize: 12 }}>
              At least 8 characters, with an uppercase letter, lowercase letter and a digit.
            </span>
          </div>
          <div className="field">
            <label>Phone number (optional)</label>
            <input value={form.phoneNumber} onChange={handleChange("phoneNumber")} />
          </div>
          <div className="field">
            <label>Shipping address (optional)</label>
            <input value={form.address} onChange={handleChange("address")} />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="muted mt-24" style={{ fontSize: 14 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
