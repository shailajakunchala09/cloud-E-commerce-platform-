package com.ecommerce.platform.repository;

import com.ecommerce.platform.entity.Order;
import com.ecommerce.platform.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserId(Long userId, Pageable pageable);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status <> 'CANCELLED'")
    BigDecimal sumRevenue();

    @Query("SELECT FUNCTION('DATE', o.createdAt), COUNT(o) FROM Order o " +
           "WHERE o.createdAt >= :since GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY 1")
    List<Object[]> countOrdersByDaySince(java.time.LocalDateTime since);
}
