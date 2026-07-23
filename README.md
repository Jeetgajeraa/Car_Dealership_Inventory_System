# 🚗 Car Dealership Inventory System

A production-grade, full-stack Web Application for managing car dealership inventory, searching and filtering vehicles, processing customer purchases, restocking stock levels, tracking purchase history, and displaying real-time admin analytics. Built with strict **Test-Driven Development (TDD)** principles.

---

## 🌟 Project Overview & Features

The **Car Dealership Inventory System** provides an end-to-end platform for both car buyers and dealership administrators. 

### 👤 Customer (`USER` Role) Capabilities
- **Account Management**: Register new accounts and log in securely with JWT token authentication and encrypted passwords.
- **Inventory Browsing**: Explore live vehicle listings with real-time stock availability, category tags, descriptions, and pricing.
- **Search & Filter**: Search and filter vehicles dynamically by Make, Model, Category (Sedan, SUV, Truck, Coupe, Electric, Hybrid), and Price Range (`minPrice` and `maxPrice`).
- **Vehicle Purchase**: Select quantity and purchase vehicles with atomic stock decrements and immediate transaction verification.
- **Purchase History**: Access a dedicated order history page displaying itemized receipts, purchase timestamps, total cost, and vehicle specs.

### 🛠️ Administrator (`ADMIN` Role) Capabilities
- **Inventory Analytics Dashboard**: View live operational stats including total vehicles in stock, aggregate inventory valuation, average listing price, and low-stock alerts.
- **Vehicle Management (CRUD)**: Create new vehicle listings with validation against duplicates, update pricing or stock levels, and delete obsolete listings.
- **Restock Operations**: Easily restock inventory quantities for any vehicle model.
- **Role-Based Access Control (RBAC)**: Granular route protection and frontend UI adaptation based on assigned role (`USER` vs `ADMIN`).

---

## 📸 Application Screenshots

### 1. Dashboard 
![Vehicle Inventory Dashboard](docs/screenshots/home.png)

### 2. Vehicle Inventory Dashboard
![Vehicle Inventory Dashboard](docs/screenshots/user_page.png)

### 3. Admin Inventory Management & Stats
![Admin Dashboard and Vehicle Modal](docs/screenshots/admin_state.png)
![Admin Dashboard and Vehicle Modal](docs/screenshots/admin_home.png)

### 4. Vehicle Purchase & Order History
![Purchase Modal and Order History](docs/screenshots/user_purchase.png)

### 5. Authentication (Login / Register)
![User Login and Registration](docs/screenshots/signin.png)

---

## 🛠️ Technology Stack

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Fast, type-safe single-page application framework |
| **Styling & UI** | Tailwind CSS v4, Lucide React | Modern responsive design system, custom glassmorphism components |
| **Backend API** | Node.js, Express v5, TypeScript | REST API architecture following Controller-Service-Repository pattern |
| **Database & ORM**| PostgreSQL (Neon DB), Prisma ORM | Relational schema management with `@prisma/adapter-pg` pooler |
| **Auth & Security**| JWT, Bcrypt, Helmet, CORS | Secure bearer tokens, hashed passwords, and HTTP security middleware |
| **Validation** | Zod | Type-safe runtime request payload validation |
| **Testing** | Jest, Supertest | 50+ unit and integration test cases following TDD methodology |

---

## 📁 Project Architecture

```
Incubyte-Task/
├── backend/                  # RESTful API Backend
│   ├── prisma/
│   │   └── schema.prisma     # Database schema (User, Vehicle, Purchase)
│   ├── src/
│   │   ├── controllers/      # Express route controllers
│   │   ├── middleware/       # JWT auth & RBAC authorization middleware
│   │   ├── repositories/     # Prisma data access layer & transactions
│   │   ├── routes/           # REST API routes (/api/v1)
│   │   ├── services/         # Core business logic layer
│   │   ├── tests/            # Jest integration & unit test suites
│   │   ├── validators/       # Zod schema validation rules
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entry point
│   ├── .env                  # Backend environment file
│   ├── env.example          # Environment setup template
│   └── package.json
├── frontend/                 # React Single-Page Application
│   ├── src/
│   │   ├── api/              # Axios instance & interceptors
│   │   ├── components/       # UI elements (Navbar, Modals, Vehicle Cards, Stats)
│   │   ├── context/          # AuthContext for session management
│   │   ├── pages/            # Page views (Catalog, Search, Purchases, Login, Register)
│   │   ├── App.tsx           # React Router route definitions
│   │   └── main.tsx          # Application entry point
│   ├── .env                  # Frontend environment file
│   ├── .env.example          # Environment setup template
│   └── package.json
├── PROMPTS.md                # Development log & TDD prompt trajectory
└── README.md                 # Project documentation & setup guide
```

---

## 🚀 Setup & Local Execution Guide

Follow these step-by-step instructions to clone, configure, and launch both the backend and frontend services locally.

### 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (recommended: `v20.x`)
- **npm**: `v9.0.0` or higher
- **PostgreSQL Database**: A local PostgreSQL database or a free cloud database instance from [Neon PostgreSQL](https://neon.tech/).

---

### 1️⃣ Setting Up the Backend Server

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `backend/` directory by copying `env.example`:
   ```bash
   cp env.example .env
   ```
   Ensure your `.env` file contains your database connection string and secret keys:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://username:password@localhost:5432/dealership_db?sslmode=prefer"
   JWT_SECRET="your_super_secret_jwt_key_here"
   ```

4. **Generate Prisma Client & Sync Database**:
   ```bash
   # Generate Prisma client code
   npx prisma generate

   # Push schema to your PostgreSQL database
   npx prisma db push
   ```

5. **Run Automated Test Suite (Optional)**:
   Verify backend server logic using Jest:
   ```bash
   npm test
   ```

6. **Start the Backend Server**:
   ```bash
   # Launch server with hot reloading
   npm run dev
   ```
   The backend REST API will start running at `http://localhost:5000`.

---

### 2️⃣ Setting Up the Frontend Application

1. **Open a new terminal window and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend/` directory (or copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Set your backend API target URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The Vite dev server will launch at `http://localhost:3000`.

---

### 3️⃣ Running Complete Application Locally

To run the full stack, keep two terminal instances open:

```bash
# Terminal 1: Start Backend API
cd backend
npm run dev

# Terminal 2: Start Frontend App
cd frontend
npm run dev
```

Visit **`http://localhost:3000`** in your web browser to use the application!

---

## 🔐 User Roles & Permissions

You can register accounts under two user roles:

| Role | Access Rights | Features Available |
| :--- | :--- | :--- |
| `USER` | Regular Customer | Browse vehicles, search & filter catalog, purchase vehicles, view purchase receipts. |
| `ADMIN` | Administrator | All `USER` permissions + Create vehicle, edit vehicle details, delete vehicle, restock inventory, and view inventory metrics. |

---

## 📖 API Endpoint Reference

Base Route: `http://localhost:5000/api/v1`

### Authentication Endpoints
- `POST /auth/register` - Register a new account (`USER` or `ADMIN`)
- `POST /auth/login` - Log in and obtain JWT access token

### Vehicle & Inventory Endpoints
- `GET /vehicles` - Fetch all vehicles (Authenticated)
- `GET /vehicles/search` - Search & filter by make, model, category, price range (Authenticated)
- `GET /vehicles/:id` - Get specific vehicle details (Authenticated)
- `POST /vehicles` - Create a new vehicle listing (Authenticated)
- `PUT /vehicles/:id` - Update vehicle listing details (Authenticated)
- `DELETE /vehicles/:id` - Delete vehicle from inventory (Admin only)
- `POST /vehicles/:id/purchase` - Purchase vehicle quantity & record transaction (Authenticated)
- `POST /vehicles/:id/restock` - Increase vehicle stock level (Admin only)

### Purchase History Endpoints
- `GET /purchases` - Retrieve purchase history with vehicle metadata (Authenticated)

### System Health
- `GET /health` - System health check status

---

## 🧪 Testing & Quality Assurance

The backend was built following Test-Driven Development (TDD):
- 50+ Jest unit and integration tests covering registration, login, JWT authentication, inventory operations, and transactional stock updates.
- Run `npm test` inside `backend/` to execute all tests.

![npm test](docs/screenshots/test.png)

---