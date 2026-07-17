package com.ecommerce.platform.service;

import com.ecommerce.platform.entity.AuditLog;
import com.ecommerce.platform.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(String actorEmail, String action, String details) {
        String ip = extractClientIp();
        AuditLog entry = AuditLog.builder()
                .actorEmail(actorEmail)
                .action(action)
                .details(details)
                .ipAddress(ip)
                .build();
        auditLogRepository.save(entry);
    }

    private String extractClientIp() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs == null) return "N/A";
            HttpServletRequest request = attrs.getRequest();
            String forwarded = request.getHeader("X-Forwarded-For");
            return (forwarded != null && !forwarded.isBlank()) ? forwarded.split(",")[0] : request.getRemoteAddr();
        } catch (Exception e) {
            return "N/A";
        }
    }
}
