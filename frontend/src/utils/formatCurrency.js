export function formatCurrency(value) {
  const num = typeof value === "number" ? value : parseFloat(value || 0);
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
