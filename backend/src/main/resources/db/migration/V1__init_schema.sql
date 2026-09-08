-- ============================================================
-- Cloud-Native Secure E-Commerce Platform - Initial Schema
-- Target: PostgreSQL 15+
-- ============================================================

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(100)  NOT NULL,
    email           VARCHAR(150)  NOT NULL UNIQUE,
    password        VARCHAR(255)  NOT NULL,
    phone_number    VARCHAR(20),
    address         VARCHAR(255),
    role            VARCHAR(20)   NOT NULL DEFAULT 'ROLE_CUSTOMER',
    enabled         BOOLEAN       NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN    NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_email ON users (email);

CREATE TABLE categories (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100)  NOT NULL UNIQUE,
    description     VARCHAR(500)
);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150)  NOT NULL,
    description     VARCHAR(2000),
    price           NUMERIC(12,2) NOT NULL CHECK (price > 0),
    stock_quantity  INTEGER       NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url       VARCHAR(500),
    category_id     BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    version         BIGINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_product_name ON products (name);
CREATE INDEX idx_product_category ON products (category_id);

CREATE TABLE carts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id              BIGSERIAL PRIMARY KEY,
    cart_id         BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    UNIQUE (cart_id, product_id)
);

CREATE TABLE orders (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount        NUMERIC(12,2) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    shipping_address    VARCHAR(255) NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_order_user ON orders (user_id);
CREATE INDEX idx_order_status ON orders (status);

CREATE TABLE order_items (
    id                      BIGSERIAL PRIMARY KEY,
    order_id                BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id              BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity                INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_at_purchase  NUMERIC(12,2) NOT NULL
);

CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    actor_email     VARCHAR(150),
    action          VARCHAR(100) NOT NULL,
    details         VARCHAR(500),
    ip_address      VARCHAR(45),
    timestamp       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_user ON audit_logs (actor_email);
CREATE INDEX idx_audit_timestamp ON audit_logs (timestamp);
