package com.ecommerce.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Entry point for the Cloud-Native Secure E-Commerce Platform.
 * <p>
 * Layered architecture: controller -> service -> repository -> database.
 * Security: stateless JWT authentication with role-based access control (RBAC).
 */
@SpringBootApplication
@EnableAsync
public class EcommercePlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommercePlatformApplication.class, args);
    }
}
