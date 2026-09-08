import React, { useEffect, useState, useCallback } from "react";
import * as adminApi from "../../api/adminApi";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/ErrorBanner";
import { formatCurrency } from "../../utils/formatCurrency";
import { statusBadgeClass } from "../../utils/orderStatusBadge";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getAllOrders(page, 10);
      setPageData(data);
    } catch (err) {
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (err) {
      setError("Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-16" style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>Orders</h1>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loading />
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F6F8FB", textAlign: "left" }}>
                <th style={{ padding: 12, fontSize: 12 }}>Order #</th>
                <th style={{ padding: 12, fontSize: 12 }}>Placed</th>
                <th style={{ padding: 12, fontSize: 12 }}>Total</th>
                <th style={{ padding: 12, fontSize: 12 }}>Status</th>
                <th style={{ padding: 12, fontSize: 12 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {pageData?.content?.map((o) => (
                <tr key={o.orderId} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: 12, fontFamily: "var(--font-data)" }}>#{o.orderId}</td>
                  <td style={{ padding: 12 }} className="muted">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 12 }} className="price">{formatCurrency(o.totalAmount)}</td>
                  <td style={{ padding: 12 }}>
                    <span className={statusBadgeClass(o.status)}>{o.status}</span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <select
                      value={o.status}
                      disabled={updatingId === o.orderId}
                      onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageData && pageData.totalPages > 1 && (
        <div className="flex" style={{ gap: 8, marginTop: 16 }}>
          <button className="btn btn-outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span className="muted" style={{ alignSelf: "center" }}>Page {page + 1} of {pageData.totalPages}</span>
          <button className="btn btn-outline" disabled={page + 1 >= pageData.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
