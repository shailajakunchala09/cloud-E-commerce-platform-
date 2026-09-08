package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.ProductRequest;
import com.ecommerce.platform.dto.response.ProductResponse;
import com.ecommerce.platform.entity.Product;
import com.ecommerce.platform.exception.ResourceNotFoundException;
import com.ecommerce.platform.repository.CategoryRepository;
import com.ecommerce.platform.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("A product used for unit testing")
                .price(new BigDecimal("49.99"))
                .stockQuantity(20)
                .active(true)
                .build();
    }

    @Test
    void getById_returnsMappedResponse_whenProductExists() {
        when(productRepository.findById(1L))
                .thenReturn(Optional.of(sampleProduct));

        ProductResponse response = productService.getById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Test Product");
        assertThat(response.isInStock()).isTrue();
    }

    @Test
    void getById_throwsResourceNotFoundException_whenProductMissing() {
        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void create_savesProductWithoutCategory_whenCategoryIdIsNull() {
        when(authentication.getName())
                .thenReturn("admin@ecommerce.local");

        when(productRepository.save(any(Product.class)))
                .thenAnswer(inv -> {
                    Product p = inv.getArgument(0);
                    p.setId(2L);
                    return p;
                });

        ProductRequest request = new ProductRequest();
        request.setName("New Product");
        request.setDescription("desc");
        request.setPrice(new BigDecimal("10.00"));
        request.setStockQuantity(5);

        ProductResponse response =
                productService.create(request, authentication);

        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getCategoryId()).isNull();

        verify(auditLogService).log(
                eq("admin@ecommerce.local"),
                eq("PRODUCT_CREATED"),
                any()
        );

        verify(categoryRepository, never()).findById(any());
    }

    @Test
    void countLowStock_delegatesToRepositoryWithThreshold() {
        when(productRepository.countByStockQuantityLessThan(10))
                .thenReturn(3L);

        long result = productService.countLowStock();

        assertThat(result).isEqualTo(3L);

        verify(productRepository)
                .countByStockQuantityLessThan(10);
    }
}