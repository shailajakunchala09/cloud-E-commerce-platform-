-- ============================================================
-- V3 - Add Premium Product Catalog
-- ============================================================

INSERT INTO products
    (name, description, price, stock_quantity, image_url, category_id, active)
VALUES

-- ELECTRONICS (category_id = 1)

('Pro Wireless Earbuds',
 'Premium true wireless earbuds with active noise cancellation and 28-hour battery life',
 89.99, 40,
 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('Mechanical RGB Keyboard',
 'Low-profile mechanical keyboard with tactile switches and customizable RGB lighting',
 119.99, 35,
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('Smart Fitness Watch',
 'Advanced smartwatch with fitness tracking, heart-rate monitoring and AMOLED display',
 199.99, 22,
 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('UltraBook Pro 14',
 'Slim performance laptop with high-resolution display and all-day battery',
 999.00, 12,
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

('Studio Wireless Headset',
 'Premium over-ear studio headset designed for immersive music and calls',
 159.99, 18,
 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',
 1, TRUE),

-- HOME & KITCHEN (category_id = 2)

('Minimalist Desk Lamp',
 'Modern LED desk lamp with adjustable brightness and warm ambient lighting',
 69.99, 45,
 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
 2, TRUE),

('Premium Coffee Maker',
 'Elegant programmable coffee maker with precision brewing and thermal carafe',
 149.99, 20,
 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85',
 2, TRUE),

('Modern Ceramic Vase',
 'Hand-finished ceramic vase designed for contemporary interiors',
 44.99, 30,
 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=85',
 2, TRUE),

('Smart Home Speaker',
 'Compact smart speaker with room-filling sound and voice assistant support',
 79.99, 28,
 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=900&q=85',
 2, TRUE),

-- BOOKS (category_id = 3)

('The Design of Everyday Things',
 'A classic guide to thoughtful design, usability and human-centered products',
 29.99, 60,
 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85',
 3, TRUE),

('Atomic Habits',
 'Practical strategies for building better habits and improving everyday performance',
 24.99, 75,
 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=85',
 3, TRUE),

('The Creative Mind',
 'An inspiring exploration of creativity, ideas and modern problem solving',
 32.50, 42,
 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85',
 3, TRUE),

-- FASHION (category_id = 4)

('Premium Leather Backpack',
 'Refined leather backpack with a spacious laptop compartment and minimalist design',
 149.00, 16,
 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
 4, TRUE),

('Classic Minimal Watch',
 'Elegant stainless-steel watch with a clean dial and premium leather strap',
 129.99, 24,
 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85',
 4, TRUE),

('Urban Running Sneakers',
 'Lightweight performance sneakers combining everyday comfort with modern styling',
 109.99, 10,
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
 4, TRUE);