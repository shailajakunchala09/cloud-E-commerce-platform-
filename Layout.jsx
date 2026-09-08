import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }} className="container mt-24">
        {children}
      </main>
      <footer className="container" style={{ padding: "24px", color: "var(--ink-soft)", fontSize: 13 }}>
        Cloud-Native Secure E-Commerce Platform — built with Spring Boot &amp; React
      </footer>
    </div>
  );
}
