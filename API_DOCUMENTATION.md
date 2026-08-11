# Eco Loop — API Documentation

**Base URL (Production):** `https://eco-loop-server-navy.vercel.app`  

**Base URL (Local):** `http://localhost:5000`

**Basic Frontend:**   `https://eco-loop-client.vercel.app` (Not Completed! Just for test purpose)

**API Prefix:** `/api/v1`  

**Version:** 1.0.0

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Response Format](#3-response-format)
4. [HTTP Status Codes](#4-http-status-codes)
5. [Auth Endpoints](#5-auth-endpoints)
6. [User Endpoints](#6-user-endpoints)
7. [Category Endpoints](#7-category-endpoints)
8. [Product Endpoints](#8-product-endpoints)
9. [Review Endpoints](#9-review-endpoints)
10. [Data Models](#10-data-models)
11. [Testing Flow](#11-testing-flow)

---

## 1. Overview

Eco Loop is a production-ready REST API built with:

- **Express.js** + **TypeScript** — server framework
- **Prisma ORM** + **PostgreSQL** — database layer
- **JWT** — stateless authentication
- **bcryptjs** — password hashing

All routes under `/api/v1/users`, `/api/v1/categories`, `/api/v1/products`, and `/api/v1/reviews` are **protected** and require a valid JWT token.

Auth routes (`/api/v1/auth/register` and `/api/v1/auth/login`) are **public**.

---

## 2. Authentication

This API uses **JWT Bearer Token** authentication.

### How to get a token

1. Register a user via `POST /api/v1/auth/register`
2. Login via `POST /api/v1/auth/login`
3. Copy the `token` from the response
4. Include it in every subsequent request as a header:

```
Authorization: Bearer <your_token_here>
```

### Example header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Tokens expire after **7 days**.

---

## 3. Response Format

Every response from this API follows the same consistent structure:

### Success response

```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... }
}
```

### Error response

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

The `data` field is only present on successful responses that return data. Delete operations return success with a message and no `data` field.

---

## 4. HTTP Status Codes

| Code | Meaning | When it happens |
|------|---------|-----------------|
| `200` | OK | Successful GET or PATCH |
| `201` | Created | Successful POST (new resource created) |
| `400` | Bad Request | Missing fields, invalid data, or Prisma validation error |
| `401` | Unauthorized | No token provided or token is invalid/expired |
| `404` | Not Found | Resource with the given ID does not exist |
| `409` | Conflict | Duplicate entry (e.g. email already registered) |
| `500` | Internal Server Error | Unexpected server-side error |

---

## 5. Auth Endpoints

Auth routes are **public** — no token required.

---

### POST `/api/v1/auth/register`

Register a new user account.

**Request Body**

```json
{
  "name": "Alex Smith",
  "email": "alex@example.com",
  "password": "password123"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ | User's display name |
| `email` | string | ✅ | Must be unique |
| `password` | string | ✅ | Will be hashed with bcrypt |

**Success Response** `201`

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "c756c6b7-7cd3-4996-a307-06f14f51b8bb",
      "name": "Alex Smith",
      "email": "alex@example.com",
      "role": "USER",
      "createdAt": "2026-08-10T15:15:07.948Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Name, email and password are required |
| `409` | Email already registered |

---

### POST `/api/v1/auth/login`

Login with an existing account and receive a JWT token.

**Request Body**

```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Success Response** `200`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "c756c6b7-7cd3-4996-a307-06f14f51b8bb",
      "name": "Alex Smith",
      "email": "alex@example.com",
      "role": "USER",
      "createdAt": "2026-08-10T15:15:07.948Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Email and password are required |
| `401` | Invalid credentials |

---

### GET `/api/v1/auth/me`

Get the currently authenticated user's profile.

**Headers Required**
```
Authorization: Bearer <token>
```

**Success Response** `200`

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "c756c6b7-7cd3-4996-a307-06f14f51b8bb",
    "name": "Alex Smith",
    "email": "alex@example.com",
    "role": "USER",
    "createdAt": "2026-08-10T15:15:07.948Z",
    "updatedAt": "2026-08-10T15:15:07.948Z"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `401` | Unauthorized: No token provided |
| `401` | Unauthorized: Invalid or expired token |
| `404` | User not found |

---

## 6. User Endpoints

All user endpoints require `Authorization: Bearer <token>`.

---

### GET `/api/v1/users`

Fetch all users that have not been soft-deleted.

**Headers Required**
```
Authorization: Bearer <token>
```

**No request body needed.**

**Success Response** `200`

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "c756c6b7-7cd3-4996-a307-06f14f51b8bb",
      "name": "Alex Smith",
      "email": "alex@example.com",
      "role": "USER",
      "createdAt": "2026-08-10T15:15:07.948Z",
      "updatedAt": "2026-08-10T15:15:07.948Z"
    }
  ]
}
```

> Passwords are never returned in any user response.

---

### POST `/api/v1/users`

Create a new user with a hashed password.

**Headers Required**
```
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123",
  "role": "USER"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ | |
| `email` | string | ✅ | Must be unique |
| `password` | string | ✅ | Hashed automatically |
| `role` | `USER` \| `ADMIN` | ❌ | Defaults to `USER` |

**Success Response** `201`

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "b6a05446-5a0c-428f-bd77-ac9a17157a56",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "USER",
    "isDeleted": false,
    "createdAt": "2026-08-10T15:27:40.078Z",
    "updatedAt": "2026-08-10T15:27:40.078Z"
  }
}
```

---

### GET `/api/v1/users/:id`

Get a single user by their UUID, including their reviews.

**Headers Required**
```
Authorization: Bearer <token>
```

**URL Parameter**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID string | The user's unique identifier |

**Success Response** `200`

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "c756c6b7-7cd3-4996-a307-06f14f51b8bb",
    "name": "Alex Smith",
    "email": "alex@example.com",
    "role": "USER",
    "reviews": [ ... ],
    "createdAt": "2026-08-10T15:15:07.948Z",
    "updatedAt": "2026-08-10T15:15:07.948Z"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `404` | User not found |

---

### PATCH `/api/v1/users/:id`

Update a user's data. Only include the fields you want to change.

**Headers Required**
```
Authorization: Bearer <token>
```

**URL Parameter**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID string | The user's unique identifier |

**Request Body** (all fields optional)

```json
{
  "name": "Alex Updated",
  "email": "newemail@example.com",
  "password": "newpassword123",
  "role": "ADMIN"
}
```

> If `password` is included, it will be re-hashed automatically.

**Success Response** `200`

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "c756c6b7-7cd3-4996-a307-06f14f51b8bb",
    "name": "Alex Updated",
    "email": "newemail@example.com",
    "role": "ADMIN",
    "updatedAt": "2026-08-10T16:00:00.000Z"
  }
}
```

---

### DELETE `/api/v1/users/:id`

Soft-delete a user. Sets `isDeleted: true`. The user is not permanently removed from the database.

**Headers Required**
```
Authorization: Bearer <token>
```

**URL Parameter**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID string | The user's unique identifier |

**Success Response** `200`

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 7. Category Endpoints

All category endpoints require `Authorization: Bearer <token>`.

---

### GET `/api/v1/categories`

Fetch all active (non-deleted) categories, including their associated products.

**Success Response** `200`

```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "a1b2c3d4-...",
      "name": "Electronics",
      "status": "ACTIVE",
      "isDeleted": false,
      "createdAt": "2026-08-10T10:00:00.000Z",
      "updatedAt": "2026-08-10T10:00:00.000Z",
      "products": [
        {
          "id": "x1y2z3...",
          "name": "Bamboo Water Bottle",
          "price": 24.99,
          "status": "ACTIVE"
        }
      ]
    }
  ]
}
```

---

### POST `/api/v1/categories`

Create a new category.

**Request Body**

```json
{
  "name": "Electronics",
  "status": "ACTIVE"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ | Must be unique |
| `status` | `ACTIVE` \| `INACTIVE` | ❌ | Defaults to `ACTIVE` |

**Success Response** `201`

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "a1b2c3d4-...",
    "name": "Electronics",
    "status": "ACTIVE",
    "isDeleted": false,
    "createdAt": "2026-08-10T10:00:00.000Z",
    "updatedAt": "2026-08-10T10:00:00.000Z"
  }
}
```

---

### GET `/api/v1/categories/:id`

Get a single category by ID, including its non-deleted products.

**URL Parameter**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID string | The category's unique identifier |

**Success Response** `200` — same shape as a single item from GET all.

**Error Responses**

| Status | Message |
|--------|---------|
| `404` | Category not found |

---

### PATCH `/api/v1/categories/:id`

Update a category. Only include fields you want to change.

**Request Body** (all fields optional)

```json
{
  "name": "Eco Supplies",
  "status": "INACTIVE"
}
```

**Success Response** `200`

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": { ...updatedCategory }
}
```

---

### DELETE `/api/v1/categories/:id`

Soft-delete a category (`isDeleted: true`).

**Success Response** `200`

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 8. Product Endpoints

All product endpoints require `Authorization: Bearer <token>`.

> **Important:** A product must be linked to an existing Category. Always create a category first and use its `id` as `categoryId`.

---

### GET `/api/v1/products`

Fetch all non-deleted products, including their category and reviews.

**Success Response** `200`

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": "x1y2z3-...",
      "name": "Bamboo Water Bottle",
      "price": 24.99,
      "categoryId": "a1b2c3d4-...",
      "status": "ACTIVE",
      "isDeleted": false,
      "createdAt": "2026-08-10T10:00:00.000Z",
      "updatedAt": "2026-08-10T10:00:00.000Z",
      "category": {
        "id": "a1b2c3d4-...",
        "name": "Electronics",
        "status": "ACTIVE"
      },
      "reviews": [ ... ]
    }
  ]
}
```

---

### POST `/api/v1/products`

Create a new product linked to a category.

**Request Body**

```json
{
  "name": "Bamboo Water Bottle",
  "price": 24.99,
  "categoryId": "a1b2c3d4-..."
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ | |
| `price` | float | ✅ | Decimal number |
| `categoryId` | UUID string | ✅ | Must reference an existing category |
| `status` | `ACTIVE` \| `INACTIVE` | ❌ | Defaults to `ACTIVE` |

**Success Response** `201`

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "x1y2z3-...",
    "name": "Bamboo Water Bottle",
    "price": 24.99,
    "categoryId": "a1b2c3d4-...",
    "status": "ACTIVE",
    "isDeleted": false,
    "createdAt": "2026-08-10T10:00:00.000Z",
    "updatedAt": "2026-08-10T10:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Foreign key constraint failed — categoryId does not exist |

---

### GET `/api/v1/products/:id`

Get a single product by ID with its category and reviews.

**Error Responses**

| Status | Message |
|--------|---------|
| `404` | Product not found |

---

### PATCH `/api/v1/products/:id`

Update product fields. Only include what you want to change.

**Request Body** (all fields optional)

```json
{
  "name": "Eco Bamboo Bottle",
  "price": 19.99,
  "status": "INACTIVE"
}
```

**Success Response** `200`

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ...updatedProduct }
}
```

---

### DELETE `/api/v1/products/:id`

Soft-delete a product (`isDeleted: true`).

**Success Response** `200`

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 9. Review Endpoints

All review endpoints require `Authorization: Bearer <token>`.

> **Important:** A review requires an existing `userId` (from Users) and `productId` (from Products).

---

### GET `/api/v1/reviews`

Fetch all non-deleted reviews with user and product details.

**Success Response** `200`

```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": [
    {
      "id": "r1s2t3-...",
      "rating": 5,
      "comment": "Great eco-friendly product!",
      "userId": "c756c6b7-...",
      "productId": "x1y2z3-...",
      "isDeleted": false,
      "createdAt": "2026-08-10T12:00:00.000Z",
      "updatedAt": "2026-08-10T12:00:00.000Z",
      "user": {
        "id": "c756c6b7-...",
        "name": "Alex Smith",
        "email": "alex@example.com"
      },
      "product": {
        "id": "x1y2z3-...",
        "name": "Bamboo Water Bottle",
        "price": 24.99
      }
    }
  ]
}
```

---

### POST `/api/v1/reviews`

Add a review for a product by a user.

**Request Body**

```json
{
  "rating": 5,
  "comment": "Great eco-friendly product!",
  "userId": "c756c6b7-...",
  "productId": "x1y2z3-..."
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `rating` | integer | ✅ | Recommended: 1–5 |
| `comment` | string | ✅ | |
| `userId` | UUID string | ✅ | Must reference an existing user |
| `productId` | UUID string | ✅ | Must reference an existing product |

**Success Response** `201`

```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "r1s2t3-...",
    "rating": 5,
    "comment": "Great eco-friendly product!",
    "userId": "c756c6b7-...",
    "productId": "x1y2z3-...",
    "isDeleted": false,
    "createdAt": "2026-08-10T12:00:00.000Z",
    "updatedAt": "2026-08-10T12:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Foreign key constraint failed — userId or productId does not exist |

---

### GET `/api/v1/reviews/:id`

Get a single review by ID with user and product details.

**Error Responses**

| Status | Message |
|--------|---------|
| `404` | Review not found |

---

### PATCH `/api/v1/reviews/:id`

Update a review's rating or comment.

**Request Body** (all fields optional)

```json
{
  "rating": 4,
  "comment": "Updated review — still a great product"
}
```

**Success Response** `200`

```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": { ...updatedReview }
}
```

---

### DELETE `/api/v1/reviews/:id`

Soft-delete a review (`isDeleted: true`).

**Success Response** `200`

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 10. Data Models

### User

```
id          String    UUID, primary key
email       String    Unique
password    String    Bcrypt hashed (never returned in responses)
name        String
role        Role      Enum: USER | ADMIN  (default: USER)
isDeleted   Boolean   Soft delete flag    (default: false)
createdAt   DateTime  Auto-set on create
updatedAt   DateTime  Auto-updated
reviews     Review[]  One-to-many relation
```

### Category

```
id          String    UUID, primary key
name        String    Unique
status      Status    Enum: ACTIVE | INACTIVE  (default: ACTIVE)
isDeleted   Boolean   Soft delete flag         (default: false)
createdAt   DateTime
updatedAt   DateTime
products    Product[] One-to-many relation
```

### Product

```
id          String    UUID, primary key
name        String
price       Float     Decimal
categoryId  String    FK → Category.id  (indexed)
category    Category  Many-to-one relation
status      Status    Enum: ACTIVE | INACTIVE  (default: ACTIVE)
isDeleted   Boolean   Soft delete flag         (default: false, indexed)
createdAt   DateTime
updatedAt   DateTime
reviews     Review[]  One-to-many relation
```

### Review

```
id          String    UUID, primary key
rating      Int
comment     String
userId      String    FK → User.id     (indexed)
user        User      Many-to-one relation
productId   String    FK → Product.id  (indexed)
product     Product   Many-to-one relation
isDeleted   Boolean   Soft delete flag (default: false, indexed)
createdAt   DateTime
updatedAt   DateTime
```

---

## 11. Testing Flow

Follow this order when testing the API from scratch — each step depends on the previous one.

```
Step 1 — Register
  POST /api/v1/auth/register
  Body: { name, email, password }

Step 2 — Login & get token
  POST /api/v1/auth/login
  Body: { email, password }
  → Copy the token from data.token

Step 3 — Verify token works
  GET /api/v1/auth/me
  Header: Authorization: Bearer <token>

Step 4 — Create a category
  POST /api/v1/categories
  Body: { name: "Electronics", status: "ACTIVE" }
  → Copy the id from response (needed for product)

Step 5 — Create a product
  POST /api/v1/products
  Body: { name, price, categoryId: "<id from step 4>" }
  → Copy the id from response (needed for review)

Step 6 — Create a review
  POST /api/v1/reviews
  Body: { rating, comment, userId: "<id from step 2>", productId: "<id from step 5>" }

Step 7 — Fetch everything
  GET /api/v1/users
  GET /api/v1/categories
  GET /api/v1/products    (includes category + reviews)
  GET /api/v1/reviews     (includes user + product)

Step 8 — Test update
  PATCH /api/v1/products/:id
  Body: { price: 19.99 }

Step 9 — Test soft delete
  DELETE /api/v1/reviews/:id
  → Item disappears from GET all but still exists in DB with isDeleted: true
```

---

*Generated for SCIC/EJP-13 Backend Project — Eco Loop Server*
