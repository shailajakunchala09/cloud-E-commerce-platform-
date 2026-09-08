package com.ecommerce.platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long lowStockProductCount;
    private Map<String, Long> ordersByStatus;
    private List<DailyOrderCount> ordersLast7Days;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class DailyOrderCount {
        private String date;
        private long count;
    }
}
