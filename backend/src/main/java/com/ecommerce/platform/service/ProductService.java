package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.ProductRequest;
import com.ecommerce.platform.dto.response.ProductResponse;
import com.ecommerce.platform.entity.Category;
import com.ecommerce.platform.entity.Product;
import com.ecommerce.platform.exception.ResourceNotFoundException;
import com.ecommerce.platform.repository.CategoryRepository;
import com.ecommerce.platform.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public Page<ProductResponse> listActive(Pageable pageable) {
        return productRepository
                .findByActiveTrue(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> listByCategory(
            Long categoryId,
            Pageable pageable) {

        return productRepository
                .findByCategoryIdAndActiveTrue(categoryId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> search(
            String keyword,
            Pageable pageable) {

        return productRepository
                .search(keyword, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return toResponse(findProductOrThrow(id));
    }

    @Transactional
    public ProductResponse create(
            ProductRequest request,
            Authentication admin) {

        Category category = null;

        if (request.getCategoryId() != null) {
            category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Category not found: "
                                            + request.getCategoryId()
                            ));
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .category(category)
                .active(true)
                .build();

        Product saved = productRepository.save(product);

        auditLogService.log(
                admin.getName(),
                "PRODUCT_CREATED",
                "Product '" + saved.getName()
                        + "' (id=" + saved.getId() + ")"
        );

        return toResponse(saved);
    }

    @Transactional
    public ProductResponse update(
            Long id,
            ProductRequest request,
            Authentication admin) {

        Product product = findProductOrThrow(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Category not found: "
                                            + request.getCategoryId()
                            ));

            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());

        Product saved = productRepository.save(product);

        auditLogService.log(
                admin.getName(),
                "PRODUCT_UPDATED",
                "Product id=" + id + " updated"
        );

        return toResponse(saved);
    }

    @Transactional
    public void delete(
            Long id,
            Authentication admin) {

        Product product = findProductOrThrow(id);

        // Soft delete preserves order history integrity
        product.setActive(false);

        productRepository.save(product);

        auditLogService.log(
                admin.getName(),
                "PRODUCT_DEACTIVATED",
                "Product id=" + id + " deactivated"
        );
    }

    @Transactional(readOnly = true)
    public long countLowStock() {
        return productRepository
                .countByStockQuantityLessThan(LOW_STOCK_THRESHOLD);
    }

    @Transactional(readOnly = true)
    Product findProductOrThrow(Long id) {
        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found: " + id
                        ));
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stockQuantity(p.getStockQuantity())
                .imageUrl(p.getImageUrl())
                .categoryId(
                        p.getCategory() != null
                                ? p.getCategory().getId()
                                : null
                )
                .categoryName(
                        p.getCategory() != null
                                ? p.getCategory().getName()
                                : null
                )
                .inStock(
                        p.getStockQuantity() != null
                                && p.getStockQuantity() > 0
                )
                .build();
    }
}