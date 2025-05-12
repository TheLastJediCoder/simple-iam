# Simple IAM API Specifications

This document outlines the probable API endpoints and their general functionality for the Simple IAM project, based on the project's controller file structure. For detailed request and response formats, please refer to the source code within the `src/controllers` directory.

## Authentication

Endpoints related to user authentication and session management.

*   **`POST /auth/login`**: Handles user login with credentials.
*   **`POST /auth/register`**: Allows new users to register.
*   **`POST /auth/logout`**: Logs out the currently authenticated user.
*   **`POST /auth/refresh-token`**: Refreshes an expired access token using a refresh token.
*   **`POST /auth/forgot-password`**: Initiates the password reset process for a user.
*   **`POST /auth/reset-password`**: Resets a user's password using a provided token.

## User Management

Endpoints for managing user accounts.

*   **`GET /users`**: Retrieves a list of all users.
*   **`GET /users/:id`**: Retrieves details of a specific user by their ID.
*   **`POST /users`**: Creates a new user account.
*   **`PUT /users/:id`**: Updates an existing user's information.
*   **`DELETE /users/:id`**: Deletes a user account.
*   **`GET /users/:userId/roles`**: Retrieves the roles assigned to a specific user.
*   **`POST /users/:userId/roles/:roleId`**: Assigns a specific role to a user.
*   **`DELETE /users/:userId/roles/:roleId`**: Removes a specific role from a user.

## Role Management

Endpoints for managing user roles and permissions.

*   **`GET /roles`**: Retrieves a list of all available roles.
*   **`GET /roles/:id`**: Retrieves details of a specific role by its ID.
*   **`POST /roles`**: Creates a new role.
*   **`PUT /roles/:id`**: Updates an existing role's information.
*   **`DELETE /roles/:id`**: Deletes a role.

## Scope Management

Endpoints for managing scopes or permissions that can be assigned to roles.

*   **`GET /scopes`**: Retrieves a list of all available scopes/permissions.
*   **`GET /scopes/:id`**: Retrieves details of a specific scope by its ID.
*   **`POST /scopes`**: Creates a new scope.
*   **`PUT /scopes/:id`**: Updates an existing scope's information.
*   **`DELETE /scopes/:id`**: Deletes a scope.

**Note:** The exact request and response payloads, required headers (like authentication tokens), and specific error handling details for each endpoint are not included in this document. Please refer to the source code within the `src/controllers` directory for this information.