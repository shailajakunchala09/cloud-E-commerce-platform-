import React, { useEffect, useState } from "react";
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

  async function loadProducts() {
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
      console.error("Product loading error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not load products."
      );

      setPageData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    productApi
      .getCategories()
      .then((data) => setCategories(data))
      .catch((err) =>
        console.error("Category loading error:", err)
      );
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, activeCategory]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    setActiveCategory(null);
    loadProducts();
  }

  function handleCategory(categoryId) {
    setActiveCategory(categoryId);
    setKeyword("");
    setPage(0);
  }

  return (
    <main className="storefront">

      {/* HERO */}
      <section className="storefront-hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            NIMBUS COMMERCE
          </div>

          <h1>
            Objects worth
            <br />
            <span>keeping.</span>
          </h1>

          <p>
            A curated collection of thoughtfully selected
            essentials for modern living.
          </p>

          <a href="#products" className="hero-cta">
            Explore collection
            <span>↓</span>
          </a>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />

          <div className="hero-glass">
            <span>CURATED</span>
            <strong>01</strong>
          </div>

          <div className="hero-symbol">
            N
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="storefront-tools">
        <div>
          <div className="section-kicker">
            DISCOVER
          </div>

          <h2>
            Find something
            <br />
            <span>exceptional.</span>
          </h2>
        </div>

        <form
          onSubmit={handleSearch}
          className="premium-search"
        >
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search products, categories..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {keyword && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setKeyword("");
                setPage(0);
                setActiveCategory(null);
              }}
            >
              ×
            </button>
          )}

          <button type="submit">
            Search
          </button>
        </form>
      </section>

      {/* CATEGORIES */}
      <section className="category-section">
        <div className="category-heading">
          <span>SHOP BY CATEGORY</span>
          <small>
            {pageData?.totalElements || 0} products
          </small>
        </div>

        <div className="category-list">
          <button
            className={`category-chip ${
              !activeCategory ? "active" : ""
            }`}
            onClick={() => handleCategory(null)}
          >
            <span>01</span>
            All products
          </button>

          {categories.map((category, index) => (
            <button
              key={category.id}
              className={`category-chip ${
                activeCategory === category.id ? "active" : ""
              }`}
              onClick={() =>
                handleCategory(category.id)
              }
            >
              <span>
                {String(index + 2).padStart(2, "0")}
              </span>

              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        className="products-section"
        id="products"
      >
        <div className="products-header">
          <div>
            <div className="section-kicker">
              THE COLLECTION
            </div>

            <h2>
              Featured
              <span> products.</span>
            </h2>
          </div>

          <div className="collection-meta">
            <span>
              {pageData?.totalElements || 0}
            </span>
            ITEMS
          </div>
        </div>

        <ErrorBanner message={error} />

        {loading ? (
          <div className="premium-loading">
            <div className="loading-line" />
            <div className="loading-line short" />
            <span>Curating collection...</span>
          </div>
        ) : (
          <>
            <div className="premium-product-grid">
              {pageData?.content?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {pageData?.content?.length === 0 && (
              <div className="empty-products">
                <div>○</div>
                <h3>No products found</h3>
                <p>
                  Try another search or explore a
                  different category.
                </p>
              </div>
            )}

            {pageData &&
              pageData.totalPages > 1 && (
                <div className="premium-pagination">
                  <button
                    disabled={page === 0}
                    onClick={() =>
                      setPage((p) => p - 1)
                    }
                  >
                    ← Previous
                  </button>

                  <div>
                    <span>
                      {String(page + 1).padStart(2, "0")}
                    </span>

                    <i>/</i>

                    {String(
                      pageData.totalPages
                    ).padStart(2, "0")}
                  </div>

                  <button
                    disabled={
                      page + 1 >=
                      pageData.totalPages
                    }
                    onClick={() =>
                      setPage((p) => p + 1)
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
          </>
        )}
      </section>

      {/* BRAND STATEMENT */}
      <section className="brand-statement">
        <div className="brand-number">
          N/01
        </div>

        <div>
          <div className="section-kicker">
            THE NIMBUS STANDARD
          </div>

          <h2>
            Less noise.
            <br />
            <span>Better choices.</span>
          </h2>
        </div>

        <p>
          We believe great commerce should feel
          effortless. Every product belongs for a reason.
        </p>
      </section>

    </main>
  );
}