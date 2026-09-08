-- H2 (dev-only) schema, mirrors the PostgreSQL production schema in db/migration.

CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
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
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)  NOT NULL UNIQUE,
    description     VARCHAR(500)
);

CREATE TABLE products (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)  NOT NULL,
    description     VARCHAR(2000),
    price           DECIMAL(12,2) NOT NULL,
    stock_quantity  INTEGER       NOT NULL DEFAULT 0,
    image_url       VARCHAR(500),
    category_id     BIGINT REFERENCES categories(id),
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    version         BIGINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_product_name ON products (name);
CREATE INDEX idx_product_category ON products (category_id);

CREATE TABLE carts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE REFERENCES users(id)
);

CREATE TABLE cart_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id         BIGINT NOT NULL REFERENCES carts(id),
    product_id      BIGINT NOT NULL REFERENCES products(id),
    quantity        INTEGER NOT NULL,
    UNIQUE (cart_id, product_id)
);

CREATE TABLE orders (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id),
    total_amount        DECIMAL(12,2) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    shipping_address    VARCHAR(255) NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_order_user ON orders (user_id);
CREATE INDEX idx_order_status ON orders (status);

CREATE TABLE order_items (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id                BIGINT NOT NULL REFERENCES orders(id),
    product_id              BIGINT NOT NULL REFERENCES products(id),
    quantity                INTEGER NOT NULL,
    unit_price_at_purchase  DECIMAL(12,2) NOT NULL
);

CREATE TABLE audit_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_email     VARCHAR(150),
    action          VARCHAR(100) NOT NULL,
    details         VARCHAR(500),
    ip_address      VARCHAR(45),
    timestamp       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
