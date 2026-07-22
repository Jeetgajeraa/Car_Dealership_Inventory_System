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
