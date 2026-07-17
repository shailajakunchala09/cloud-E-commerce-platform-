import React from "react";

export default function Loading({ label = "Loading..." }) {
  return <div className="muted text-center" style={{ padding: "48px 0" }}>{label}</div>;
}
