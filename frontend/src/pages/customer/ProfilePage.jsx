import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function ProfilePage() {
  const [form, setForm] = useState({ fullName: "", phoneNumber: "", address: "" });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/users/me").then((res) => {
      const { fullName, phoneNumber, address } = res.data;
      setForm({ fullName: fullName || "", phoneNumber: phoneNumber || "", address: address || "" });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiClient.put("/users/me", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError("Could not update profile.");
    }
  };

  if (loading) return null;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h2 className="mb-16">Profile</h2>
      <div className="card" style={{ padding: 24 }}>
        <ErrorBanner message={error} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="field">
            <label>Phone number</label>
            <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          </div>
          <div className="field">
            <label>Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <button className="btn btn-primary">{saved ? "Saved ✓" : "Save changes"}</button>
        </form>
      </div>
    </div>
  );
}
