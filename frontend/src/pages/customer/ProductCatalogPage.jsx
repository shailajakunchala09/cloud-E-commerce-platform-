import React, { useEffect, useState, useCallback } from "react";
import * as productApi from "../../api/productApi";
import ProductCard from "../../components/common/ProductCard";
import Loading from "../../components/common/Loading";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function ProductCatalogPage() {
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let data;

      if (keyword.trim()) {
        data = await productApi.searchProducts(keyword.trim(), page);
      } else if (activeCategory) {
        data = await productApi.getProductsByCategory(activeCategory, page);
      } else {
        data = await productApi.getProducts(page);
      }

      setPageData(data);
    } catch (err) {
      setError("Could not load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, keyword]);

  useEffect(() => {
    productApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveCategory(null);
    loadProducts();
  };

  return (
    <div>
      <div
        className="flex-between mb-16"
        style={{ flexWrap: "wrap", gap: 12 }}
      >
        <h2>Catalog</h2>

        <form onSubmit={handleSearch} className="flex" style={{ gap: 8 }}>
          <input
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              width: 240,
            }}
          />

          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
      </div>

      <div
        className="flex mb-16"
        style={{ gap: 8, flexWrap: "wrap" }}
      >
        <button
          className={`btn ${
            !activeCategory ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => {
            setActiveCategory(null);
            setKeyword("");
            setPage(0);
          }}
        >
          All
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            className={`btn ${
              activeCategory === c.id ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => {
              setActiveCategory(c.id);
              setKeyword("");
              setPage(0);
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            className="grid"
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {pageData?.content?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pageData?.content?.length === 0 && (
            <p
              className="muted text-center"
              style={{ padding: 48 }}
            >
              No products found.
            </p>
          )}

          {pageData && pageData.totalPages > 1 && (
            <div className="flex-between mt-24">
              <button
                className="btn btn-outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>

              <span className="muted">
                Page {page + 1} of {pageData.totalPages}
              </span>

              <button
                className="btn btn-outline"
                disabled={page + 1 >= pageData.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}