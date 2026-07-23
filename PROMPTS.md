## Prompt 1

### User Prompt
> Help me design the Prisma schema for a Car Dealership Inventory System for the given description and set up the Express server.

### AI Assistance(GPT-5.5)
- Designed `User` and `Vehicle` models
- Recommended `Decimal` for prices
- Created initial Prisma schema
- Configured environment variables
- Set up Express with middleware and a health endpoint

## Prompt 2

### User Prompt
> According to user routes make an tests for user registration

### AI Assistance(GPT-5.5)
- Added test cases for user registration

## Prompt 3

### User Prompt
> Implement the registration feature to satisfy the failing TDD tests.

### AI Assistance(Gemini 3.6)
- Created Zod validation schema
- Implemented user repository
- Implemented authentication service
- Added password hashing with bcrypt
- Implemented registration controller
- Updated error handling for validation errors

## Prompt 4

### User Prompt
> According to user routes make an tests for user login

### AI Assistance(Gemini 3.6)
- Added test cases for user login

## Prompt 5

### User Prompt
> Implement the login feature to satisfy the failing TDD tests.

### AI Assistance(Gemini 3.6)
- Implemented login controller

## Prompt 6

### User Prompt
> test(auth): add JWT authentication middleware tests

Added failing tests for missing token, invalid token,
expired token, deleted user, and successful authentication.

### AI Assistance(Gemini 3.6)
- Added unit test suite for JWT authentication middleware (`authenticate`) covering missing token, invalid token, expired token, deleted user, and successful authentication
- Added unit tests for role authorization middleware (`authorizeRole`)

## Prompt 7

### User Prompt
> feat(auth): implement JWT authentication middleware

Implemented JWT verification, authenticated request handling,
and user lookup for protected routes.

### AI Assistance(Gemini 3.6)
- Implemented JWT token verification and payload decoding in `authenticate` middleware
- Implemented database user lookup to verify user existence for protected routes
- Added `authorizeRole` middleware for role-based access control

## Prompt 8

### User Prompt
> test(vehicles): add vehicle creation endpoint tests

Added failing tests for creating vehicles (unauthenticated request rejection,
role authorization check, valid creation payload, validation errors, duplicate vehicle rejection).

### AI Assistance(Gemini 3.6)
- Created test suite `createVehicle.test.ts` for `POST /api/v1/vehicles` endpoint
- Verified test suite failure (🔴 RED Phase)

## Prompt 9

### User Prompt
> feat(vehicles): implement vehicle creation endpoint

Implemented vehicle validation schema, repository, service,
controller, and route guarded by admin authorization.

### AI Assistance(Gemini 3.6)
- Created Zod validation schema `createVehicleSchema` in `vehicle.validator.ts`
- Implemented `VehicleRepository` and `VehicleService` with duplicate vehicle check
- Implemented `createVehicle` controller and registered `POST /api/v1/vehicles` route with `authenticate` & `authorizeRole("ADMIN")`
- Verified 100% test pass rate (🟢 GREEN Phase)

## Prompt 10

### User Prompt
> test(vehicles): add get all vehicles endpoint tests

Added failing tests for retrieving available vehicles (unauthenticated request rejection,
empty list response, list of all available vehicles for authenticated users).

### AI Assistance(Gemini 3.6)
- Created test suite `getVehicles.test.ts` for `GET /api/v1/vehicles` endpoint
- Verified test suite failure (🔴 RED Phase)

## Prompt 11

### User Prompt
> feat(vehicles): implement get all vehicles endpoint

Implemented repository findAll query, service, controller, and route
handler for retrieving available vehicles.

### AI Assistance(Gemini 3.6)
- Added `findAll` query in `VehicleRepository` ordered by creation date
- Added `getVehicles` service method and controller handler
- Registered `GET /api/v1/vehicles` route guarded by `authenticate` middleware
- Verified 100% test pass rate (🟢 GREEN Phase)

## Prompt 12

### User Prompt
> test(vehicles): add vehicle search and filter endpoint tests

Added failing tests for searching and filtering vehicles by make, model,
categoryId, and price range (minPrice and maxPrice).

### AI Assistance(Gemini 3.6)
- Created test suite `searchVehicles.test.ts` for `GET /api/v1/vehicles/search` endpoint
- Verified test suite failure (🔴 RED Phase)

## Prompt 13

### User Prompt
> feat(vehicles): implement vehicle search and filter endpoint

Implemented search validation schema, repository search query,
service method, controller handler, and search route.

### AI Assistance(Gemini 3.6)
- Created `searchVehicleSchema` in `vehicle.validator.ts`
- Implemented `search` query in `VehicleRepository` handling case-insensitive filtering for make, model, categoryId, and price range (`minPrice`, `maxPrice`)
- Implemented `searchVehicles` service method and controller handler
- Registered `GET /api/v1/vehicles/search` route guarded by `authenticate` middleware
- Verified 100% test pass rate (🟢 GREEN Phase)

## Prompt 14

### User Prompt
> test(vehicles): add update vehicle endpoint tests

Added failing tests for updating vehicle details (unauthenticated request rejection,
non-admin authorization rejection, 404 for non-existent vehicle, valid update payload, validation errors).

### AI Assistance(Gemini 3.6)
- Created test suite `updateVehicle.test.ts` for `PUT /api/v1/vehicles/:id` endpoint
- Verified test suite failure (🔴 RED Phase)

## Prompt 15

### User Prompt
> feat(vehicles): implement update vehicle details endpoint

Implemented update vehicle validation schema, repository update method,
service vehicle existence check, controller handler, and admin route.

### AI Assistance(Gemini 3.6)
- Created `updateVehicleSchema` in `vehicle.validator.ts`
- Added `findById` and `update` methods in `VehicleRepository`
- Implemented `updateVehicle` method in `VehicleService` with 404 check
- Implemented `updateVehicle` controller handler and registered `PUT /api/v1/vehicles/:id` route guarded by `authenticate` & `authorizeRole("ADMIN")`
- Verified 100% test pass rate (🟢 GREEN Phase)

## Prompt 16

### User Prompt
> test(vehicles): add delete vehicle endpoint tests

Added failing tests for deleting vehicles (unauthenticated request rejection,
non-admin authorization rejection, 404 for non-existent vehicle, successful deletion).

### AI Assistance(Gemini 3.6)
- Created test suite `deleteVehicle.test.ts` for `DELETE /api/v1/vehicles/:id` endpoint
- Verified test suite failure (🔴 RED Phase)

## Prompt 17

### User Prompt
> feat(vehicles): implement delete vehicle endpoint

Implemented repository delete method, service vehicle existence check,
controller handler, and admin route.

### AI Assistance(Gemini 3.6)
- Added `delete` method in `VehicleRepository`
- Implemented `deleteVehicle` method in `VehicleService` with 404 check
- Implemented `deleteVehicle` controller handler and registered `DELETE /api/v1/vehicles/:id` route guarded by `authenticate` & `authorizeRole("ADMIN")`
- Verified 100% test pass rate (🟢 GREEN Phase)

## Prompt 18

### User Prompt
> test(inventory): add vehicle purchase and restock endpoint tests

Added failing tests for purchasing vehicles (unauthenticated rejection, 404 non-existent vehicle,
insufficient stock rejection, successful purchase & stock decrement) and restocking vehicles
(non-admin rejection, invalid quantity rejection, successful restock & stock increment).

### AI Assistance(Gemini 3.6)
- Created test suite `inventory.test.ts` for `POST /api/v1/vehicles/:id/purchase` & `POST /api/v1/vehicles/:id/restock`
- Verified test suite failure (🔴 RED Phase)

## Prompt 19

### User Prompt
> feat(inventory): implement vehicle purchase and restock endpoints

Implemented purchase and restock validation schemas, repository transaction methods,
service stock checks, controller handlers, and purchase/restock routes.

### AI Assistance(Gemini 3.6)
- Added `purchaseVehicleSchema` & `restockVehicleSchema` in `vehicle.validator.ts`
- Added Prisma transaction `purchase` and atomic increment `restock` methods in `VehicleRepository`
- Added `purchaseVehicle` (with stock validation) and `restockVehicle` methods in `VehicleService`
- Implemented `purchaseVehicle` & `restockVehicle` controller handlers and mounted `POST /api/v1/vehicles/:id/purchase` and `POST /api/v1/vehicles/:id/restock` routes
- Verified 100% test pass rate (🟢 GREEN Phase)

## Prompt 20

### User Prompt
> test(vehicles): add get vehicle details by id endpoint tests

Added failing tests for retrieving vehicle by ID (unauthenticated request rejection,
404 for non-existent vehicle ID, successful retrieval for authenticated user).

### AI Assistance(Gemini 3.6)
- Created test suite `getVehicleById.test.ts` for `GET /api/v1/vehicles/:id` endpoint
- Verified test suite failure (🔴 RED Phase)

## Prompt 21

### User Prompt
> feat(vehicles): implement get vehicle details by id endpoint

Implemented service `getVehicleById` method with 404 check,
controller handler, and mounted route.

### AI Assistance(Gemini 3.6)
- Added `getVehicleById` method in `VehicleService`
- Added `getVehicleById` controller handler in `vehicle.controller.ts`
- Registered `GET /api/v1/vehicles/:id` route guarded by `authenticate` middleware
- Verified 100% test pass rate (🟢 GREEN Phase)

## Prompt 22

### User Prompt
> test(purchases): add get user purchase history endpoint tests

Added failing tests for user purchase history (unauthenticated request rejection,
empty list for user with no purchases, purchase history with vehicle details for authenticated user).

### AI Assistance(Gemini 3.6)
- Created test suite `getPurchases.test.ts` for `GET /api/v1/purchases` endpoint
- Verified test suite failure (🔴 RED Phase)

## Prompt 23

### User Prompt
> feat(purchases): implement get user purchase history endpoint

Implemented PurchaseRepository, PurchaseService, PurchaseController, and mounted purchase routes under /api/v1/purchases.

### AI Assistance(Gemini 3.6)
- Created `PurchaseRepository` with `findByUserId` query including vehicle relation
- Created `PurchaseService` and `getUserPurchases` controller handler
- Mounted `GET /api/v1/purchases` route guarded by `authenticate` middleware
- Verified 100% test pass rate (🟢 GREEN Phase)

## Prompt 24

### User Prompt
> feat(frontend): initialize React + Vite + Tailwind CSS frontend application

Scaffolded React TypeScript project using Vite, installed Tailwind CSS v4, Lucide React icons, React Router DOM, and Axios.

### AI Assistance(Gemini 3.6)
- Initialized `frontend/` with Vite React TypeScript template
- Installed `@tailwindcss/vite`, `tailwindcss`, `lucide-react`, `react-router-dom`, `axios`
- Configured `@tailwindcss/vite` plugin and `/api` proxy targeting backend server on port 5000 in `vite.config.ts`
- Built welcome interface and verified clean production build (`npm run build`)

## Prompt 25

### User Prompt
> feat(frontend): implement color design system, AuthContext, Sign In, and Sign Up pages

Implemented color palette tokens, AuthContext state, Axios interceptor, floating pill Navbar, and Sign In & Sign Up pages.

### AI Assistance(Claude sonet 4.6)
- Configured mint background, forest teal, and vibrant lime color tokens in `index.css`
- Built `AuthContext` with JWT session persistence in `localStorage`
- Created `Navbar` floating pill matching signature design
- Created `LoginPage` (`POST /api/v1/auth/login`) with email/password validation
- Created `RegisterPage` (`POST /api/v1/auth/register`)
- Verified 100% clean production build (`npm run build`)

## Prompt 26

### User Prompt
>for admin states design test cases which include inventory states

### AI Assistance(Claude sonet 4.6)
- test cases made for state  

## Prompt 27

### User Prompt
>according to state.test make controller and their services which calculate the state for car inventory

### AI Assistance(Claude sonet 4.6)
- services for car inventory is implemented with all test pass 



