-- ============================================================
-- Seed data: default admin account + sample catalog
-- Default admin password is "Admin@123" (BCrypt hash below) — CHANGE IMMEDIATELY after first login.
-- ============================================================

INSERT INTO users (full_name, email, password, role, enabled, account_non_locked)
VALUES (
    'Platform Administrator',
    'admin@ecommerce.local',
    '$2a$12$4iC2b7bJj6EwzKQ6mGz1FeUeS3zqAaZC8W3zTfsG8pTnB0GkQEwPa', -- BCrypt("Admin@123")
    'ROLE_ADMIN',
    TRUE,
    TRUE
);

INSERT INTO categories (name, description) VALUES
    ('Electronics', 'Phones, laptops, gadgets and accessories'),
    ('Home & Kitchen', 'Appliances and household essentials'),
    ('Books', 'Fiction, non-fiction and educational titles'),
    ('Fashion', 'Clothing, footwear and accessories');

INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active) VALUES
    ('Wireless Noise-Cancelling Headphones', 'Over-ear Bluetooth headphones with 30-hour battery life', 129.99, 50, 'https://picsum.photos/seed/headphones/400', 1, TRUE),
    ('27-inch 4K Monitor', 'Ultra HD IPS display with USB-C connectivity', 349.00, 25, 'https://picsum.photos/seed/monitor/400', 1, TRUE),
    ('Stainless Steel Cookware Set', '10-piece set suitable for all stovetops', 189.50, 15, 'https://picsum.photos/seed/cookware/400', 2, TRUE),
    ('Clean Architecture', 'A Craftsman''s Guide to Software Structure and Design', 34.99, 100, 'https://picsum.photos/seed/book1/400', 3, TRUE),
    ('Men''s Running Shoes', 'Lightweight breathable trainers', 79.99, 8, 'https://picsum.photos/seed/shoes/400', 4, TRUE);
