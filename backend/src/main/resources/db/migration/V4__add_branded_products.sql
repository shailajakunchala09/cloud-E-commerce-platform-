-- ============================================================
-- V4 - Add Branded Premium Product Catalog
-- ============================================================

INSERT INTO products
    (name, description, price, stock_quantity, image_url, category_id, active)
VALUES

-- ============================================================
-- ELECTRONICS
-- ============================================================

('Apple AirPods Pro',
 'Premium wireless earbuds with active noise cancellation, transparency mode and spatial audio',
 249.00, 25,
 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('Sony WH-1000XM5',
 'Flagship wireless noise-cancelling headphones with immersive sound and all-day comfort',
 399.99, 18,
 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('Samsung Galaxy Watch',
 'Premium smartwatch with fitness tracking, AMOLED display and advanced everyday features',
 299.99, 20,
 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('Logitech MX Mechanical',
 'Premium mechanical keyboard designed for productivity with tactile low-profile switches',
 169.99, 30,
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('Apple MacBook Air',
 'Slim performance laptop with a high-resolution display, powerful processor and all-day battery',
 1099.00, 10,
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('JBL Charge Speaker',
 'Portable premium Bluetooth speaker with powerful sound and extended battery life',
 179.99, 24,
 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

-- ============================================================
-- HOME & KITCHEN
-- ============================================================

('Nespresso Coffee Machine',
 'Premium capsule coffee machine designed for consistent espresso and coffee at home',
 189.99, 18,
 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85',
 2, TRUE),

('Philips Hue Smart Lamp',
 'Connected smart lighting with adjustable brightness and ambient colour control',
 89.99, 35,
 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
 2, TRUE),

('Dyson Air Purifier',
 'Premium air purification system designed for cleaner and more comfortable indoor spaces',
 499.99, 12,
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85',
 2, TRUE),

('Le Creuset Dutch Oven',
 'Premium cast-iron cookware designed for versatile everyday cooking and long-term use',
 379.99, 14,
 'https://images.unsplash.com/photo-1584990347449-a2d4f2b5e4f2?auto=format&fit=crop&w=900&q=85',
 2, TRUE),

-- ============================================================
-- BOOKS
-- ============================================================

('Atomic Habits',
 'Practical strategies for building better habits and creating lasting behavioural change',
 24.99, 75,
 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=85',
 3, TRUE),

('The Design of Everyday Things',
 'A classic guide to thoughtful design, usability and human-centred products',
 29.99, 60,
 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85',
 3, TRUE),

('Steve Jobs',
 'A detailed biography exploring the life, work and influence of Apple co-founder Steve Jobs',
 21.99, 45,
 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85',
 3, TRUE),

-- ============================================================
-- FASHION
-- ============================================================

('Nike Air Max',
 'Iconic everyday sneakers combining responsive cushioning with a contemporary athletic design',
 149.99, 20,
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
 4, TRUE),

('Adidas Ultraboost',
 'Performance running shoes designed for responsive cushioning and everyday comfort',
 179.99, 16,
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
 4, TRUE),

('Ray-Ban Classic Sunglasses',
 'Timeless sunglasses with a refined frame designed for everyday style',
 159.99, 22,
 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
 4, TRUE),

('Fossil Leather Watch',
 'Classic stainless-steel watch with a refined dial and premium leather strap',
 139.99, 24,
 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85',
 4, TRUE),

('Levi''s Premium Denim',
 'Classic premium denim designed with a timeless fit and everyday durability',
 89.99, 30,
 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
 4, TRUE);