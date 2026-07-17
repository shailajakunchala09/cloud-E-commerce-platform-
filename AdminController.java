package com.ecommerce.platform.controller;

import com.ecommerce.platform.dto.request.OrderStatusUpdateRequest;
import com.ecommerce.platform.dto.response.DashboardSummaryResponse;
import com.ecommerce.platform.dto.response.OrderResponse;
import com.ecommerce.platform.entity.AuditLog;
import com.ecommerce.platform.entity.OrderStatus;
import com.ecommerce.platform.repository.AuditLogRepository;
import com.ecommerce.platform.service.DashboardService;
import com.ecommerce.platform.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * All endpoints here require ROLE_ADMIN — enforced both at the SecurityFilterChain
 * level (/api/admin/**) and per-method via @PreAuthorize as defense in depth.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin dashboard analytics and order management")
public class AdminController {

    private final DashboardService dashboardService;
    private final OrderService orderService;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<DashboardSummaryResponse> summary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderResponse>> allOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<Page<OrderResponse>> ordersByStatus(@PathVariable OrderStatus status, Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status, pageable));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                             @Valid @RequestBody OrderStatusUpdateRequest request,
                                                             Authentication auth) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus(), auth));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLog>> auditLogs(Pageable pageable) {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc(pageable));
    }
}
