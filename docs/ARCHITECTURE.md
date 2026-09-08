# System Architecture

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser["React SPA<br/>(Customer + Admin Dashboards)"]
    end

    subgraph Edge["Edge / Delivery"]
        Nginx["Nginx<br/>(static hosting, gzip, security headers)"]
        LB["AWS Application Load Balancer<br/>(TLS termination)"]
    end

    subgraph App["Application Layer — Spring Boot"]
        Filter["JWT Authentication Filter"]
        Controller["REST Controllers<br/>(Auth / Product / Cart / Order / Admin)"]
        Service["Service Layer<br/>(business logic, transactions)"]
        Repo["Spring Data JPA Repositories"]
    end

    subgraph Data["Data Layer"]
        PG[("PostgreSQL<br/>Primary Database")]
        Flyway["Flyway<br/>(versioned schema migrations)"]
    end

    subgraph Cloud["Cloud & DevOps (AWS reference deployment)"]
        ECS["ECS / EKS<br/>(containerized backend)"]
        RDS[("Amazon RDS for PostgreSQL")]
        S3["S3 + CloudFront<br/>(static frontend hosting)"]
        Secrets["AWS Secrets Manager<br/>(JWT secret, DB credentials)"]
        CW["CloudWatch<br/>(logs, metrics, alarms)"]
    end

    Browser -->|HTTPS| Nginx
    Nginx -->|"/api/**"| LB
    Browser -.->|"HTTPS (direct in local/dev)"| LB
    LB --> Filter
    Filter --> Controller
    Controller --> Service
    Service --> Repo
    Repo --> PG
    Flyway --> PG

    ECS -. "runs" .-> App
    S3 -. "hosts" .-> Client
    ECS --> RDS
    ECS --> Secrets
    ECS --> CW
```

## Layered Backend Architecture

The backend follows a strict **layered architecture** to keep concerns separated and code testable:

```mermaid
flowchart LR
    A["Controller Layer<br/>(REST endpoints, request/response DTOs, validation)"]
    B["Service Layer<br/>(business rules, transactions, orchestration)"]
    C["Repository Layer<br/>(Spring Data JPA, query methods)"]
    D["Entity / Domain Layer<br/>(JPA entities, persistence mapping)"]
    E[("Database")]

    A --> B --> C --> D --> E
```

- **Controllers** never talk to repositories directly — they always go through a service.
- **Services** own transaction boundaries (`@Transactional`) and business invariants (e.g. stock checks, price snapshotting on order placement).
- **DTOs** are used at the API boundary so entities are never serialized directly to clients (prevents accidental exposure of fields like `password`).
- **GlobalExceptionHandler** centralizes error translation so no layer needs to format HTTP responses itself.

## Security Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant API as Spring Boot API
    participant DB as PostgreSQL

    U->>F: Enter email + password
    F->>API: POST /api/auth/login
    API->>DB: Look up user by email
    DB-->>API: User (BCrypt hash)
    API->>API: Verify password with BCrypt
    API->>API: Generate signed JWT (HS256, 24h expiry)
    API-->>F: 200 OK { token, role, ... }
    F->>F: Store token in memory/localStorage
    F->>API: GET /api/orders (Authorization: Bearer <token>)
    API->>API: JwtAuthenticationFilter validates signature + expiry
    API->>API: SecurityContext populated with roles
    API->>API: @PreAuthorize / URL rules check ROLE_CUSTOMER or ROLE_ADMIN
    API-->>F: 200 OK (authorized) or 401/403 (denied)
```

Key controls implemented:

| Control | Implementation |
|---|---|
| Authentication | Stateless JWT (HS256), issued on login/register |
| Password storage | BCrypt, work factor 12 — never stored or logged in plaintext |
| Authorization | Role-Based Access Control (`ROLE_CUSTOMER`, `ROLE_ADMIN`) via Spring Security URL rules + method-level `@PreAuthorize` |
| Transport | HTTPS enforced at the load balancer / reverse proxy |
| CORS | Explicit allow-list of trusted origins |
| Input validation | Jakarta Bean Validation on every request DTO |
| Error handling | `GlobalExceptionHandler` — no stack traces or internal messages ever reach the client |
| Auditability | `AuditLog` entries for login attempts, order placement, and admin mutations |
| Data integrity | Optimistic locking (`@Version`) on `Product` to prevent overselling under concurrent checkout |
| Secrets | Injected via environment variables / AWS Secrets Manager — never hard-coded |

## Reference AWS Deployment

This project is designed to map cleanly onto a standard AWS deployment, without requiring one to run locally:

- **Compute:** Backend container deployed to **ECS Fargate** (or EKS) behind an **Application Load Balancer**
- **Database:** **Amazon RDS for PostgreSQL** (Multi-AZ for production)
- **Frontend:** Static build served from **S3** behind **CloudFront**
- **Secrets:** **AWS Secrets Manager** for `JWT_SECRET` and DB credentials, injected as environment variables at task startup
- **Observability:** **CloudWatch** for centralized logs and metrics; Spring Boot Actuator exposes `/actuator/health` for ALB health checks
- **CI/CD:** GitHub Actions builds and pushes Docker images to **Amazon ECR**, then triggers an ECS service update (see `.github/workflows/ci-cd.yml`)
