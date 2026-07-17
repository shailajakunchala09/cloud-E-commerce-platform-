package com.ecommerce.platform.controller;

import com.ecommerce.platform.dto.request.ProductRequest;
import com.ecommerce.platform.dto.response.ProductResponse;
import com.ecommerce.platform.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product catalog browsing and management")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "List active products (paginated)")
    public ResponseEntity<Page<ProductResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(productService.listActive(pageable));
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<Page<ProductResponse>> search(@RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(productService.search(keyword, pageable));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Filter products by category")
    public ResponseEntity<Page<ProductResponse>> byCategory(@PathVariable Long categoryId, Pageable pageable) {
        return ResponseEntity.ok(productService.listByCategory(categoryId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new product (admin only)")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request, auth));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a product (admin only)")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request, Authentication auth) {
        return ResponseEntity.ok(productService.update(id, request, auth));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate (soft-delete) a product (admin only)")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        productService.delete(id, auth);
        return ResponseEntity.noContent().build();
    }
}
