export function statusBadgeClass(status) {
  switch (status) {
    case "DELIVERED":
      return "badge badge-success";
    case "CANCELLED":
      return "badge badge-danger";
    case "PENDING":
      return "badge badge-warning";
    default:
      return "badge badge-neutral"; // CONFIRMED, SHIPPED
  }
}
