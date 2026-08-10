# Eco Loop Server

A production-ready, scalable, and well-structured REST API built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. Designed to seamlessly integrate with the Eco Loop frontend application.

---

## 1. Tech Stack

| Technology | Purpose |
|---|---|
| Express.js | Web framework |
| TypeScript | Type safety |
| PostgreSQL / NeonDB | Relational database |
| Prisma ORM | Database client & migrations |
| JWT (jsonwebtoken / jose) | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| CORS | Cross-origin resource sharing |

---

## 2. Project Structure

```
eco-loop-server/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── routes/
│   ├── services/
│   │     ├── user/
│   │     ├── category/
│   │     ├── product/
│   │     └── review/
│   │
│   └── lib/
│
├── .env
├── package.json
└── tsconfig.json
```

---

## 3. Database Design

Normalized relational schema using Prisma with soft delete support, timestamps, and table mapping via `@@map()`.

### Enums

```prisma
enum Role {
  USER
  ADMIN
}

enum Status {
  ACTIVE
  INACTIVE
}
```

### Models

**User** — `@@map("users")`
- `id`, `email` (unique), `password`, `name`, `role` (Role), `isDeleted`, `createdAt`, `updatedAt`
- Relations: `reviews Review[]`

**Category** — `@@map("categories")`
- `id`, `name` (unique), `status` (Status), `isDeleted`, `createdAt`, `updatedAt`
- Relations: `products Product[]`

**Product** — `@@map("products")`
- `id`, `name`, `price`, `categoryId`, `status` (Status), `isDeleted`, `createdAt`, `updatedAt`
- Relations: `category Category`, `reviews Review[]`

**Review** — `@@map("reviews")`
- `id`, `rating`, `comment`, `userId`, `productId`, `isDeleted`, `createdAt`, `updatedAt`
- Relations: `user User`, `product Product`

---

## 4. Authentication System

| Feature | Implementation |
|---|---|
| User Registration | `POST /api/v1/auth/register` |
| Login | `POST /api/v1/auth/login` |
| Password Hashing | `bcryptjs` |
| Token Issuance | `jsonwebtoken` / `jose` (JWT) |

---

## 5. Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (local, Supabase, or NeonDB)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

### Running the Server

```bash
# Development (with watch)
npm run dev

# Production build
npm run build
npm start
```

---

## 6. API Endpoints

All responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {}
}
```

### 6.1 Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT token |

---

### 6.2 Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/users` | Fetch all non-deleted users |
| POST | `/api/v1/users` | Create user with hashed password |
| GET | `/api/v1/users/:id` | Get single user by ID |
| PATCH | `/api/v1/users/:id` | Update user data |
| DELETE | `/api/v1/users/:id` | Soft delete user (`isDeleted: true`) |

---

### 6.3 Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/categories` | Fetch all non-deleted categories |
| POST | `/api/v1/categories` | Create category |
| GET | `/api/v1/categories/:id` | Get category with products |
| PATCH | `/api/v1/categories/:id` | Update category |
| DELETE | `/api/v1/categories/:id` | Soft delete category |

---

### 6.4 Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/products` | Fetch products with category & reviews |
| POST | `/api/v1/products` | Create product linked to `categoryId` |
| GET | `/api/v1/products/:id` | Get product details by ID |
| PATCH | `/api/v1/products/:id` | Update product |
| DELETE | `/api/v1/products/:id` | Soft delete product |

---

### 6.5 Reviews

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/reviews` | Fetch reviews with user & product details |
| POST | `/api/v1/reviews` | Add review linked to `userId` & `productId` |
| GET | `/api/v1/reviews/:id` | Get review details by ID |
| PATCH | `/api/v1/reviews/:id` | Update review rating or comment |
| DELETE | `/api/v1/reviews/:id` | Soft delete review |

---

## 7. Request & Response Examples

### Create Product

**POST** `/api/v1/products`

Request body:
```json
{
  "name": "Bamboo Water Bottle",
  "price": 24.99,
  "categoryId": "uuid-of-category"
}
```

Response:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Bamboo Water Bottle",
    "price": 24.99,
    "categoryId": "uuid-of-category",
    "status": "ACTIVE",
    "isDeleted": false,
    "createdAt": "2026-08-10T10:29:03.000Z",
    "updatedAt": "2026-08-10T10:29:03.000Z"
  }
}
```

### Add Review

**POST** `/api/v1/reviews`

Request body:
```json
{
  "rating": 5,
  "comment": "Great eco-friendly product!",
  "userId": "uuid-of-user",
  "productId": "uuid-of-product"
}
```

Response:
```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Great eco-friendly product!",
    "userId": "uuid-of-user",
    "productId": "uuid-of-product",
    "isDeleted": false,
    "createdAt": "2026-08-10T10:29:03.000Z"
  }
}
```

---

## 8. HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK — successful GET / PATCH |
| 201 | Created — successful POST |
| 400 | Bad Request — validation error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found — resource does not exist |
| 500 | Internal Server Error |

---

## 9. Prisma Features Used

- Prisma Client (generated)
- Prisma Migrate
- Prisma Studio
- Relations (one-to-many)
- Enums (`Role`, `Status`)
- Soft Delete (`isDeleted` flag)
- Table mapping (`@@map()`)
- Timestamps (`createdAt`, `updatedAt`)

---

## 10. Frontend Integration

The backend is fully integrated with the **Eco Loop Client** (Next.js):

- All backend APIs are consumed by the frontend.
- Authentication works end-to-end via JWT stored in cookies/localStorage.
- CRUD operations update the UI in real time.

---

## 11. Scripts Reference

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start with hot reload (`tsx watch`) |
| Build | `npm run build` | Compile TypeScript to `dist/` |
| Start | `npm start` | Run compiled production build |
| Migrate | `npx prisma migrate dev` | Apply schema migrations |
| Studio | `npx prisma studio` | Open visual DB browser |
| Generate | `npx prisma generate` | Regenerate Prisma Client |
