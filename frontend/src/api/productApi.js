import apiClient from "./apiClient";

export function getProducts(page = 0, size = 12) {
  return apiClient
    .get("/products?page=" + page + "&size=" + size)
    .then(function (res) {
      return res.data;
    });
}

export function searchProducts(keyword, page = 0, size = 12) {
  return apiClient
    .get(
      "/products/search?keyword=" +
        encodeURIComponent(keyword) +
        "&page=" +
        page +
        "&size=" +
        size
    )
    .then(function (res) {
      return res.data;
    });
}

export function getProductsByCategory(categoryId, page = 0, size = 12) {
  return apiClient
    .get(
      "/products/category/" +
        categoryId +
        "?page=" +
        page +
        "&size=" +
        size
    )
    .then(function (res) {
      return res.data;
    });
}

export function getProduct(id) {
  return apiClient.get("/products/" + id).then(function (res) {
    return res.data;
  });
}

export function createProduct(payload) {
  return apiClient.post("/products", payload).then(function (res) {
    return res.data;
  });
}

export function updateProduct(id, payload) {
  return apiClient.put("/products/" + id, payload).then(function (res) {
    return res.data;
  });
}

export function deleteProduct(id) {
  return apiClient.delete("/products/" + id);
}

export function getCategories() {
  return apiClient.get("/categories").then(function (res) {
    return res.data;
  });
}