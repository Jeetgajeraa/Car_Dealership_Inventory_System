# Car Dealership Inventory System - Backend API

A robust, production-ready RESTful API backend built for managing car dealership inventory, processing purchases, tracking stock levels, and handling multi-role user authentication.

Built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL** using strict **Test-Driven Development (TDD)** principles.

---

## 🚀 Tech Stack

- **Runtime & Language**: Node.js & TypeScript
- **Web Framework**: Express v5
- **Database & ORM**: PostgreSQL (Neon Cloud) with Prisma ORM & `@prisma/adapter-pg`
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Validation**: Zod schema validation
- **Testing**: Jest & Supertest (53 automated tests, 97.4% statement coverage)
- **Security**: Helmet, CORS, Role-Based Access Control (RBAC)

---

## 📁 Project Architecture

The project adheres to a clean, layered architecture:

```
backend/
├── prisma/
│   └── schema.prisma         # Prisma database schemas (User, Vehicle, Purchase)
├── src/
│   ├── controllers/          # Express route controllers & response handlers
│   ├── middleware/           # Auth, RBAC, and global error handling middleware
│   ├── repositories/         # Database access layer (Prisma queries & transactions)
│   ├── routes/               # API route definitions & route grouping
│   ├── services/             # Core business logic & validations
│   ├── tests/                # Jest integration & unit test suites
│   ├── utils/                # Custom ApiError helper
│   ├── validators/           # Zod input validation schemas
│   ├── app.ts                # Express app initialization & middleware configuration
│   ├── prisma.ts             # Prisma client instance with PostgreSQL pooler adapter
│   └── server.ts             # Server entry point
├── jest.config.ts            # Jest configuration setup
└── package.json
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL Database**: Neon Cloud PostgreSQL instance or local database URL

### 2. Environment Variables Setup
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="your_super_secret_jwt_key_here"
```

### 3. Installation & Database Sync

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Sync Database Schema
npx prisma db push
```

### 4. Running the Application

```bash
# Development server (with hot reload via tsx)
npm run dev

# Build TypeScript code
npm run build

# Production server
npm start
```

### 5. Running Automated Tests

```bash
# Run all Jest test suites
npm test
```

---

## 🔐 Authentication & Authorization Model

The API uses **JWT Bearer Token** authentication.

1. **Header Format**: Include the JWT in request headers for protected endpoints:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```
2. **Roles**:
   - `USER`: Regular customer capability (browse, search, purchase vehicles, view purchase history).
   - `ADMIN`: Administrator capability (all user privileges + add, update, delete vehicles, and restock inventory).

---

## 📖 API Endpoint Reference

Base API Route: `/api/v1`

### 1. Authentication Endpoints (`/api/v1/auth`)

#### `POST /api/v1/auth/register`
Registers a new user account.

- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "ramesh Gujral",
    "email": "ramesh@example.com",
    "password": "Password123!",
    "role": "USER"
  }
  ```
  *(Note: `role` is optional and defaults to `"USER"`. Allowed values: `"USER"`, `"ADMIN"`)*
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": "cmr...",
      "name": "ramesh Gujral",
      "email": "ramesh@example.com",
      "role": "USER",
      "createdAt": "2026-07-22T09:00:00.000Z"
    }
  }
  ```

#### `POST /api/v1/auth/login`
Authenticates user credentials and returns a JWT token.

- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "Ramesh@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "cmr...",
      "name": "Ramesh Gujral",
      "email": "Ramesh@example.com",
      "role": "USER"
    }
  }
  ```

---

### 2. Vehicle Inventory Endpoints (`/api/v1/vehicles`)

#### `GET /api/v1/vehicles`
Retrieves a list of all available vehicles in inventory.

- **Access**: Protected (`USER` & `ADMIN`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Vehicles retrieved successfully",
    "data": [
      {
        "id": "cmr...",
        "make": "Toyota",
        "model": "Camry",
        "categoryId": "sedan",
        "price": "25000",
        "quantity": 10,
        "description": "2024 Toyota Camry LE",
        "createdAt": "2026-07-22T09:00:00.000Z"
      }
    ]
  }
  ```

#### `GET /api/v1/vehicles/search`
Searches and filters vehicles by criteria.

- **Access**: Protected (`USER` & `ADMIN`)
- **Query Parameters**:
  - `make` (string, optional): Case-insensitive make filter (e.g. `Toyota`)
  - `model` (string, optional): Case-insensitive model filter (e.g. `Camry`)
  - `categoryId` (string, optional): Category ID filter (e.g. `sedan`, `suv`)
  - `minPrice` (number, optional): Minimum price threshold
  - `maxPrice` (number, optional): Maximum price threshold
- **Example**: `GET /api/v1/vehicles/search?make=Toyota&minPrice=20000&maxPrice=30000`
- **Response (200 OK)**: Array of matching vehicles.

#### `GET /api/v1/vehicles/:id`
Retrieves detailed information for a specific vehicle by ID.

- **Access**: Protected (`USER` & `ADMIN`)
- **Response (200 OK)**: Single vehicle object.

#### `POST /api/v1/vehicles`
Adds a new vehicle to inventory. Rejects duplicate composite `[make, model, categoryId]`.

- **Access**: Admin Only (`ADMIN`)
- **Request Body**:
  ```json
  {
    "make": "Honda",
    "model": "Civic",
    "categoryId": "sedan",
    "price": 24000,
    "quantity": 5,
    "description": "2024 Honda Civic Sport"
  }
  ```
- **Response (201 Created)**: Created vehicle object.

#### `PUT /api/v1/vehicles/:id`
Updates vehicle details (partial updates allowed).

- **Access**: Admin Only (`ADMIN`)
- **Request Body** *(All fields optional)*:
  ```json
  {
    "price": 24500,
    "quantity": 8,
    "description": "Updated price and description"
  }
  ```
- **Response (200 OK)**: Updated vehicle object.

#### `DELETE /api/v1/vehicles/:id`
Deletes a vehicle from inventory.

- **Access**: Admin Only (`ADMIN`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Vehicle deleted successfully"
  }
  ```

---

### 3. Inventory Operations (`/api/v1/vehicles`)

#### `POST /api/v1/vehicles/:id/purchase`
Purchases a vehicle. Decrements inventory quantity atomically using a Prisma transaction and records the purchase history.

- **Access**: Protected (`USER` & `ADMIN`)
- **Request Body**:
  ```json
  {
    "quantity": 1
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Vehicle purchased successfully",
    "data": {
      "vehicle": {
        "id": "cmr...",
        "quantity": 4
      },
      "purchase": {
        "id": "cmr...",
        "userId": "usr...",
        "vehicleId": "cmr...",
        "quantity": 1,
        "totalPrice": 24000
      }
    }
  }
  ```

#### `POST /api/v1/vehicles/:id/restock`
Restocks vehicle inventory by increasing the stock quantity.

- **Access**: Admin Only (`ADMIN`)
- **Request Body**:
  ```json
  {
    "quantity": 10
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Vehicle restocked successfully",
    "data": {
      "id": "cmr...",
      "quantity": 14
    }
  }
  ```

---

### 4. Purchase History Endpoints (`/api/v1/purchases`)

#### `GET /api/v1/purchases`
Retrieves purchase history for the authenticated user with embedded vehicle details.

- **Access**: Protected (`USER` & `ADMIN`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Purchase history retrieved successfully",
    "data": [
      {
        "id": "cmr...",
        "userId": "usr...",
        "vehicleId": "cmr...",
        "quantity": 1,
        "totalPrice": "24000",
        "createdAt": "2026-07-22T09:00:00.000Z",
        "vehicle": {
          "id": "cmr...",
          "make": "Honda",
          "model": "Civic",
          "price": "24000"
        }
      }
    ]
  }
  ```

---

### 5. System Health (`/health`)

#### `GET /health`
Returns the status of the server.

- **Access**: Public
- **Response (200 OK)**:
  ```json
  {
    "status": "UP",
    "timestamp": "2026-07-22T09:00:00.000Z"
  }
  ```

---

## ⚠️ Error Handling & Envelope Structure

All error responses adhere to a consistent JSON format:

```json
{
  "success": false,
  "message": "Human readable error description",
  "error": "Error details or validation array"
}
```

| HTTP Status Code | Scenario |
| :--- | :--- |
| **`400 Bad Request`** | Input validation failure (Zod error), non-positive numbers, or insufficient vehicle stock |
| **`401 Unauthorized`** | Missing or invalid JWT Authorization header |
| **`403 Forbidden`** | Insufficient user role permissions (e.g. non-Admin attempting to delete vehicle) |
| **`404 Not Found`** | Endpoint or database record (Vehicle / User) not found |
| **`409 Conflict`** | Duplicate resource creation (e.g. registered email or duplicate make/model/category) |
| **`500 Internal Server Error`** | Unhandled system exception |
