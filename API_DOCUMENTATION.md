# API Documentation

## Authentication

### Login

**Endpoint:** `/auth/login`
**Method:** `POST`

**Description:** Handles user login and generates access and refresh tokens.

**Request Body (`LoginRequest`)**

| Property | Type   | Description      |
| :------- | :----- | :--------------- |
| `email`  | `string` | User's email address. |
| `password` | `string` | User's password.     |

**Response Body (`LoginResponse`)**

| Property      | Type   | Description      |
| :------------ | :----- | :--------------- |
| `accessToken` | `string` | JWT access token.  |
| `refreshToken`| `string` | JWT refresh token. |

### Logout

**Endpoint:** `/auth/logout`
**Method:** `POST`

**Description:** Handles user logout by revoking the access token.

**Request Body (`LogoutRequest`)**

| Property      | Type   | Description      |
| :------------ | :----- | :--------------- |
| `accessToken` | `string` | JWT access token to revoke. |

**Response Body:**
```
json
{
  "success": "Logout successfully"
}
```
### Refresh Token

**Endpoint:** `/auth/refresh-token`
**Method:** `POST`

**Description:** Refreshes an expired access token using a valid refresh token.

**Request Body (`RefreshTokenRequest`)**

| Property       | Type   | Description      |
| :------------- | :----- | :--------------- |
| `refreshToken` | `string` | JWT refresh token. |

**Response Body (`RefreshTokenResponse`)**

| Property      | Type   | Description        |
| :------------ | :----- | :----------------- |
| `accessToken` | `string` | New JWT access token. |
| `refreshToken`| `string` | The refresh token used for the request. |

### Register

**Endpoint:** `/auth/register`
**Method:** `POST`

**Description:** Handles user registration and creates a new user in the database.

**Request Body (`RegisterRequest`)**

| Property | Type   | Description        |
| :------- | :----- | :----------------- |
| `email`  | `string` | New user's email address. |
| `password` | `string` | New user's password.   |

**Response Body:**
```
json
{
  "message": "User registered successfully",
  "userId": "string"
}
```
### Forgot Password

**Endpoint:** `/auth/forgot-password`
**Method:** `POST`

**Description:** Initiates the forgot password process. In a real application, this would send a password reset email.

**Request Body (`ForgotPasswordRequest`)**

| Property | Type   | Description        |
| :------- | :----- | :----------------- |
| `email`  | `string` | Email address of the user who forgot their password. |

**Response Body:**
```
json
{
  "message": "If a user with that email exists, a password reset link will be sent."
}
```
### Reset Password

**Endpoint:** `/auth/reset-password`
**Method:** `POST`

**Description:** Resets the user's password using a valid reset token.

**Request Body (`ResetPasswordRequest`)**

| Property    | Type   | Description        |
| :---------- | :----- | :----------------- |
| `password`  | `string` | Old password of the user. |
| `newPassword` | `string` | The new password.   |

**Headers:**

| Header        | Type   | Description        |
| :------------ | :----- | :----------------- |
| `Authorization` | `string` | Bearer token (the reset token). |

**Response Body:**
```
json
{
  "message": "Password reset successfully"
}
```
### Authorize (Test Endpoint)

**Endpoint:** `/auth/authorize`
**Method:** `POST`

**Description:** A simple endpoint to test authorization with middleware.

**Response Body:**
```
json
{
  "message": "Successfully authorize"
}
```
## Roles

### Create Role

**Endpoint:** `/roles`
**Method:** `POST`

**Description:** Handles the creation of a new role.

**Request Body (`CreateRoleRequest`)**

| Property | Type        | Description                |
| :------- | :---------- | :------------------------- |
| `name`   | `string`    | The name of the new role.   |
| `scopes` | `Scope[]`   | Optional array of scopes to link to the role. Each item should be an object with an `id` property. |

**Response Body (`CreateRoleResponse`)**

| Property | Type        | Description                |
| :------- | :---------- | :------------------------- |
| `id`     | `string`    | The ID of the newly created role. |
| `name`   | `string`    | The name of the newly created role. |
| `scopes` | `Scope[]`   | The scopes linked to the new role. |

### Get Role by ID

**Endpoint:** `/roles/:id`
**Method:** `GET`

**Description:** Retrieves a role by its ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the role to retrieve. |

**Response Body (`GetRoleByIdResponse`)**

| Property | Type        | Description               |
| :------- | :---------- | :------------------------ |
| `id`     | `string`    | The ID of the role.       |
| `name`   | `string`    | The name of the role.     |
| `scopes` | `Scope[]`   | The scopes linked to the role. |

### Update Role

**Endpoint:** `/roles/:id`
**Method:** `PUT`

**Description:** Updates an existing role by its ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the role to update. |

**Request Body (`UpdateRoleRequest`)**

| Property | Type        | Description                    |
| :------- | :---------- | :----------------------------- |
| `name`   | `string`    | Optional: The new name for the role. |
| `scopes` | `Scope[]`   | Optional: A full list of desired scopes for the role. Existing links will be removed and replaced with these. Each item should be an object with an `id` property. |

**Response Body (`UpdateRoleResponse`)**

| Property | Type        | Description               |
| :------- | :---------- | :------------------------ |
| `id`     | `string`    | The ID of the updated role. |
| `name`   | `string`    | The name of the updated role. |
| `scopes` | `Scope[]`   | The scopes linked to the updated role. |

### Delete Role

**Endpoint:** `/roles/:id`
**Method:** `DELETE`

**Description:** Deletes a role by its ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the role to delete. |

**Response Body:**

*   Returns a `204 No Content` status code on successful deletion.

## Scopes

### Create Scope

**Endpoint:** `/scopes`
**Method:** `POST`

**Description:** Handles the creation of a new scope.

**Request Body (`CreateScopeRequest`)**

| Property | Type        | Description        |
| :------- | :---------- | :----------------- |
| `name`   | `string`    | The name of the new scope. |
| `type`   | `ScopesType` | The type of the new scope. |

**Response Body (`CreateScopeResponse`)**

| Property | Type        | Description         |
| :------- | :---------- | :------------------ |
| `id`     | `string`    | The ID of the created scope. |
| `name`   | `string`    | The name of the created scope. |
| `type`   | `ScopesType` | The type of the created scope. |

### Get Scope by ID

**Endpoint:** `/scopes/:id`
**Method:** `GET`

**Description:** Handles fetching a scope by its ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the scope to retrieve. |

**Response Body (`GetScopeByIdResponse`)**

| Property | Type        | Description        |
| :------- | :---------- | :----------------- |
| `id`     | `string`    | The ID of the scope. |
| `name`   | `string`    | The name of the scope. |
| `type`   | `ScopesType` | The type of the scope. |

### Update Scope

**Endpoint:** `/scopes/:id`
**Method:** `PUT`

**Description:** Handles updating an existing scope by its ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the scope to update. |

**Request Body (`UpdateScopeRequest`)**

| Property | Type        | Description            |
| :------- | :---------- | :--------------------- |
| `id`     | `string`    | The ID of the scope to update. |
| `name`   | `string`    | Optional: The new name for the scope. |
| `type`   | `ScopesType` | Optional: The new type for the scope. |

**Response Body (`UpdateScopeResponse`)**

| Property | Type        | Description         |
| :------- | :---------- | :------------------ |
| `id`     | `string`    | The ID of the updated scope. |
| `name`   | `string`    | The name of the updated scope. |
| `type`   | `ScopesType` | The type of the updated scope. |

### Delete Scope

**Endpoint:** `/scopes/:id`
**Method:** `DELETE`

**Description:** Handles deleting a scope by its ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the scope to delete. |

**Response Body:**

*   Returns a `204 No Content` status code on successful deletion.

## Users

### Add User

**Endpoint:** `/users`
**Method:** `POST`

**Description:** Handles the addition of a new user.

**Request Body (`CreateUserRequest`)**

| Property | Type      | Description                     |
| :------- | :-------- | :------------------------------ |
| `email`  | `string`  | The email address of the new user. |
| `password` | `string`  | The password for the new user.  |
| `roles`  | `Role[]`  | Optional: An array of roles to assign to the new user. Each item should be an object with an `id` property. |

**Response Body (`CreateUserResponse`)**

| Property | Type      | Description                     |
| :------- | :-------- | :------------------------------ |
| `id`     | `string`  | The ID of the newly created user. |
| `email`  | `string`  | The email address of the new user. |
| `roles`  | `Role[]`  | The roles assigned to the new user. |

### Get User by ID

**Endpoint:** `/users/:id`
**Method:** `GET`

**Description:** Retrieves a user by their ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the user to retrieve. |

**Response Body (`GetUserByIdResponse`)**

| Property | Type      | Description          |
| :------- | :-------- | :------------------- |
| `id`     | `string`  | The ID of the user.  |
| `email`  | `string`  | The email address of the user. |
| `roles`  | `Role[]`  | The roles assigned to the user. |

### Update User

**Endpoint:** `/users/:id`
**Method:** `PUT`

**Description:** Updates an existing user by their ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the user to update. |

**Request Body (`UpdateUserRequest`)**

| Property | Type      | Description                    |
| :------- | :-------- | :----------------------------- |
| `email`  | `string`  | Optional: The new email address for the user. |
| `password` | `string`  | Optional: The new password for the user. |
| `roles`  | `Role[]`  | Optional: A full list of desired roles for the user. Existing links will be removed and replaced with these. Each item should be an object with an `id` property. |

**Response Body (`UpdateUserResponse`)**

| Property | Type      | Description          |
| :------- | :-------- | :------------------- |
| `id`     | `string`  | The ID of the updated user. |
| `email`  | `string`  | The email address of the updated user. |
| `roles`  | `Role[]`  | The roles assigned to the updated user. |

### Delete User

**Endpoint:** `/users/:id`
**Method:** `DELETE`

**Description:** Deletes a user by their ID.

**URL Parameters:**

| Parameter | Type   | Description        |
| :-------- | :----- | :----------------- |
| `id`      | `string` | The ID of the user to delete. |

**Response Body:**

*   Returns a `204 No Content` status code on successful deletion.