import React from "react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      className="card"
      style={{ background: "var(--danger-bg)", borderColor: "var(--danger)", color: "var(--danger)", padding: "12px 16px", marginBottom: 16, fontSize: 14 }}
    >
      {message}
    </div>
  );
}
