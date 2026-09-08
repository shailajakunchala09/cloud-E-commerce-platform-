# Database Schema (Entity-Relationship Diagram)

Target database: **PostgreSQL 16** (schema owned and versioned by Flyway — see `backend/src/main/resources/db/migration`).

```mermaid
erDiagram
    USERS ||--o| CARTS : "has one"
    USERS ||--o{ ORDERS : "places many"
    CARTS ||--o{ CART_ITEMS : contains
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : "referenced by"
    PRODUCTS ||--o{ ORDER_ITEMS : "referenced by"
    CATEGORIES ||--o{ PRODUCTS : classifies

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password "BCrypt hash"
        varchar phone_number
        varchar address
        varchar role "ROLE_CUSTOMER / ROLE_ADMIN"
        boolean enabled
        boolean account_non_locked
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar description
    }

    PRODUCTS {
        bigint id PK
        varchar name
        varchar description
        numeric price
        int stock_quantity
        varchar image_url
        bigint category_id FK
        boolean active "soft delete flag"
        bigint version "optimistic lock"
        timestamp created_at
        timestamp updated_at
    }

    CARTS {
        bigint id PK
        bigint user_id FK "unique — one cart per user"
    }

    CART_ITEMS {
        bigint id PK
        bigint cart_id FK
        bigint product_id FK
        int quantity
    }

    ORDERS {
        bigint id PK
        bigint user_id FK
        numeric total_amount
        varchar status "PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED"
        varchar shipping_address
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        numeric unit_price_at_purchase "price snapshot"
    }

    AUDIT_LOGS {
        bigint id PK
        varchar actor_email
        varchar action
        varchar details
        varchar ip_address
        timestamp timestamp
    }
```

## Design Notes

- **Price snapshotting** — `order_items.unit_price_at_purchase` captures the price at checkout time, so historical orders stay accurate even if a product's price later changes. `cart_items` deliberately has no such snapshot, since cart contents are expected to reflect live prices.
- **Soft delete for products** — `products.active` is used instead of hard deletes so that historical `order_items` referencing a discontinued product remain valid and queryable.
- **Optimistic locking** — `products.version` (JPA `@Version`) prevents lost updates when two checkouts race to decrement the same product's stock.
- **One cart per user** — enforced with a `UNIQUE` constraint on `carts.user_id`.
- **Audit trail** — `audit_logs` is intentionally decoupled from the transactional tables (no foreign keys) so audit writes never fail or roll back a business transaction, and so the table can later be shipped to a separate log store without a schema change.
- **Indexes** — added on all foreign keys and frequently filtered/searched columns (`users.email`, `products.name`, `products.category_id`, `orders.user_id`, `orders.status`, `audit_logs.timestamp`).
