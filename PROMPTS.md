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
