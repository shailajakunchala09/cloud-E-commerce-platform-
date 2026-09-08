import React, { useEffect, useState, useCallback } from "react";
import * as productApi from "../../api/productApi";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/ErrorBanner";
import { formatCurrency } from "../../utils/formatCurrency";

const EMPTY_FORM = { id: null, name: "", description: "", price: "", stockQuantity: "", imageUrl: "", categoryId: "" };

export default function AdminProductsPage() {
  const [pageData, setPageData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productApi.getProducts(page, 10);
      setPageData(data);
    } catch (err) {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    productApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity, 10),
      imageUrl: form.imageUrl,
      categoryId: form.categoryId ? parseInt(form.categoryId, 10) : null,
    };
    try {
      if (form.id) {
        await productApi.updateProduct(form.id, payload);
      } else {
        await productApi.createProduct(payload);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this product? It will no longer be visible to customers.")) return;
    try {
      await productApi.deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError("Could not deactivate product.");
    }
  };

  return (
    <div>
      <div className="flex-between mb-16">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>Products</h1>
        <button className="btn btn-primary" onClick={openCreateForm}>+ New Product</button>
      </div>

      {error && <ErrorBanner message={error} />}

      {showForm && (
        <form className="card mb-24" style={{ padding: 20 }} onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 16 }}>{form.id ? "Edit Product" : "New Product"}</h3>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="field">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Price (USD)</label>
              <input required type="number" step="0.01" min="0.01" value={form.price}
                     onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="field">
              <label>Stock Quantity</label>
              <input required type="number" min="0" value={form.stockQuantity}
                     onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="flex" style={{ gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F6F8FB", textAlign: "left" }}>
                <th style={{ padding: 12, fontSize: 12 }}>Name</th>
                <th style={{ padding: 12, fontSize: 12 }}>Category</th>
                <th style={{ padding: 12, fontSize: 12 }}>Price</th>
                <th style={{ padding: 12, fontSize: 12 }}>Stock</th>
                <th style={{ padding: 12, fontSize: 12 }}></th>
              </tr>
            </thead>
            <tbody>
              {pageData?.content?.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: 12 }}>{p.name}</td>
                  <td style={{ padding: 12 }} className="muted">{p.categoryName || "—"}</td>
                  <td style={{ padding: 12 }} className="price">{formatCurrency(p.price)}</td>
                  <td style={{ padding: 12 }}>
                    <span className={`badge ${p.stockQuantity < 10 ? "badge-warning" : "badge-success"}`}>
                      {p.stockQuantity} units
                    </span>
                  </td>
                  <td style={{ padding: 12, textAlign: "right" }}>
                    <button className="btn btn-outline" style={{ marginRight: 8 }} onClick={() => openEditForm(p)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Deactivate</button>
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
