package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.response.DashboardSummaryResponse;
import com.ecommerce.platform.entity.OrderStatus;
import com.ecommerce.platform.repository.OrderRepository;
import com.ecommerce.platform.repository.ProductRepository;
import com.ecommerce.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DashboardSummaryResponse getSummary() {
        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status.name(), orderRepository.countByStatus(status));
        }

        LocalDateTime since = LocalDate.now().minusDays(6).atStartOfDay();
        List<Object[]> raw = orderRepository.countOrdersByDaySince(since);
        List<DashboardSummaryResponse.DailyOrderCount> daily = raw.stream()
                .map(row -> DashboardSummaryResponse.DailyOrderCount.builder()
                        .date(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build())
                .toList();

        return DashboardSummaryResponse.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .totalRevenue(orderRepository.sumRevenue())
                .lowStockProductCount(productRepository.countByStockQuantityLessThan(10))
                .ordersByStatus(ordersByStatus)
                .ordersLast7Days(daily)
                .build();
    }
}
