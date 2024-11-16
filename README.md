[![npm version](https://badge.fury.io/js/pocket-rest-lib.svg)](https://www.npmjs.com/package/pocket-rest-lib)
[![npm downloads](https://img.shields.io/npm/dm/pocket-rest-lib.svg)](https://www.npmjs.com/package/pocket-rest-lib)
# Pocket REST Lib

**Pocket REST Lib** is an NPM library designed to simplify API interactions through a structured and consistent way to perform CRUD operations and authentication with minimal effort. It is totally inspired by [PocketBase](https://github.com/pocketbase/pocketbase)'s amazingly simple request mapping. It eliminates the need to manually design and call APIs, letting the developers focus on fast development.

While doing academic projects, I found it wasting to think on how to map the API requests every time I made some application. PocketBase's simplified mapping and fetching got me really fascinated. So, I thought why not just implement a REST mapping much like this one and integrate with my backend?

---
#### Note: There are some dissimilarities with the actual PocketBase's original JS library, such as getting file urls, and realtime features. This is because I kept things simple and parallel with my own projects
---

## Table of Contents

1. [Pocket REST Lib](#pocket-rest-lib)
2. [Features](#features)
3. [Installation](#installation)
4. [Setup and Usage](#setup-and-usage)
   - [1. Backend Setup](#1-backend-setup)
   - [2. Import the Library](#2-import-the-library)
   - [3. Initialize the Client](#3-initialize-the-client)
   - [4. Usage](#4-usage)
5. [API Reference](#api-reference)
   - [Endpoints](#endpoints)
   - [Query Parameters in Detail](#query-parameters-in-detail)
     - [Pagination](#pagination)
     - [Sorting](#sorting)
     - [Filtering](#filtering)
     - [Expanding Relations](#expanding-relations)
     - [Field Selection](#field-selection)
     - [Skip Total](#skip-total)
   - [Notes](#notes)
6. [Requirements](#requirements)
7. [Why Use PocketBase API Wrapper?](#why-use-pocketbase-api-wrapper)
8. [Contributions](#contributions)
9. [Acknowledgments](#acknowledgments)

## Features

- **Simplified CRUD Operations**: No need to write separate `create`, `update`, `delete`, or `get` functions.
- **Built-in Error Handling**: Eliminates the hassle of writing repetitive `try-catch` blocks.
- **Native Fetch Support**: Works with native `fetch`; no need for additional HTTP libraries like `Axios`.
- **Authentication Support**: Built-in support for JWT-based authentication using `authWithPassword`.
- **Real-time Updates**: Uses WebSocket for real-time communication, unlike PocketBase.
- **Minimal Dependencies**: Includes only the `jwt-decode` library as a dependency.

---

## Installation

To install the library, run:

```bash
npm install pocket-rest-lib
```

## Setup and Usage

### 1. **Backend Setup**

Your backend must follow the request mapping structure show in this documentation to integrate with this library. Refer to this Section: [API Reference](#api-reference)

### 2. **Import the Library**

```javascript
import PocketRestLib from 'pocket-rest-lib';
```

### 3. **Initialize the Client**

```javascript
const client = new PocketRestLib('https://your-backend-url.com');
```

### 4. **Usage**

---

### Collection Management

You can manage a specific collection by calling the `collection` method:

```javascript
const users = client.collection('users');
```

---

### CRUD Operations

The `Collection` object provides methods to perform CRUD operations.

#### Create
```javascript
await users.create({ username: 'john_doe', email: 'john@example.com' });
```

#### Read One
```javascript
const user = await users.getOne('12345');
```

#### Read List
```javascript
const userList = await users.getList(1, 20, { filter: "verified=true" });
```

#### Update
```javascript
await users.update('12345', { username: 'john_updated' });
```

#### Delete
```javascript
await users.delete('12345');
```

#### Get Full List
Retrieve all records (paginated internally):

```javascript
const allUsers = await users.getFullList();
```

#### Get First List Item
Retrieve the first item matching a filter:

```javascript
const firstUser = await users.getFirstListItem("email='john@example.com'");
```

---

### Authentication

Authenticate with a username and password:

```javascript
const authResponse = await users.authWithPassword('john@example.com', 'securepassword');
```

Authentication tokens are automatically stored and reused for subsequent requests.

---

### Real-time Subscriptions
My realtime implementation uses WebSocket connections unlike [PocketBase](https://github.com/pocketbase/pocketbase)'s SSE. So, it's different.

Subscribe to real-time updates on a collection:

```javascript
const subscription = users.subscribe();

subscription.onCreate((data) => {
    console.log('Record created:', data);
});

subscription.onUpdate((data) => {
    console.log('Record updated:', data);
});

subscription.onDelete((data) => {
    console.log('Record deleted:', data);
});
```

To unsubscribe:

```javascript
users.unsubscribe();
```

---

### File Management

Generate file URLs for specific records:

```javascript
const fileUrl = users.file('recordId', 'filename.jpg');
console.log(fileUrl); // Outputs: https://your-backend-url.com/api/files/users/recordId/filename.jpg
```

---

## Methods

### Collection Methods

| Method                      | Description                                         |
|-----------------------------|-----------------------------------------------------|
| `create(data, auth?)`       | Create a new record.                                |
| `update(id, data, auth?)`   | Update a record by ID.                              |
| `delete(id, auth?)`         | Delete a record by ID.                              |
| `getOne(id, options?, auth?)` | Retrieve a single record by ID.                  |
| `getList(page, perPage, options?, auth?)` | Retrieve a paginated list of records. |
| `getFullList(options?, auth?)` | Retrieve all records (paginated internally).    |
| `getFirstListItem(filter, options?, auth?)` | Retrieve the first matching record. |
| `subscribe()`               | Subscribe to real-time updates via WebSocket.       |
| `unsubscribe()`             | Unsubscribe from WebSocket updates.                |
| `authWithPassword(identity, password)` | Authenticate using email and password. |
| `file(recordId, filename)`  | Generate a file URL for a specific record.          |

---

### Authentication Store Methods

| Method                      | Description                                         |
|-----------------------------|-----------------------------------------------------|
| `loadFromCookie(cookie, key?)` | Load authentication from a cookie.              |
| `exportToCookie(options?, key?)` | Export authentication to a cookie.           |
| `save(token, model)`        | Save authentication token and model to storage.    |
| `clear()`                   | Clear authentication data from storage.            |

---

### CRUD Helper Functions

The `crud` utility simplifies HTTP methods.

| Function     | Description                                         |
|--------------|-----------------------------------------------------|
| `GET(url)`   | Perform a GET request to the specified URL.         |
| `POST(url, body)` | Perform a POST request with a JSON or FormData body. |
| `PATCH(url, body)` | Perform a PATCH request with a JSON or FormData body. |
| `DELETE(url)` | Perform a DELETE request to the specified URL.     |

---

## Error Handling

Errors are logged to the console. To handle errors programmatically, you can modify the `crud` functions or wrap calls in a `try-catch` block.

---

## Example Usage

```javascript
import PocketRestLib from 'pocket-rest-lib';

const client = new PocketRestLib('https://your-backend-url.com');
const users = client.collection('users');

(async () => {
    // Authenticate
    const auth = await users.authWithPassword('admin@example.com', 'adminpassword');

    // Create a new user
    await users.create({ username: 'new_user', email: 'new@example.com' });

    // Retrieve user list
    const userList = await users.getList(1, 10, { sort: '-created' });

    console.log(userList);

    // Subscribe to real-time updates
    const subscription = users.subscribe();

    subscription.onCreate((data) => console.log('User created:', data));
})();
```

---

## API Reference

Here's a detailed API mapping documentation. This is pretty much similar to PocketBase's:

---

### Endpoints

#### **GET** `/api/collections/:collectionName/records`

Retrieve a paginated list of records from a specific collection.

##### Query Parameters

| Parameter      | Type    | Description                                                                                   | Default |
|----------------|---------|-----------------------------------------------------------------------------------------------|---------|
| `page`         | Number  | The page (offset) of the paginated list.                                                      | `1`     |
| `perPage`      | Number  | Maximum number of records per page.                                                           | `30`    |
| `sort`         | String  | Sort order of the records. Use `-` for DESC or `+` (default) for ASC.                         | None    |
| `filter`       | String  | Apply filters to the records. Example: `filter=(id='abc' && created>'2022-01-01')`.           | None    |
| `expand`       | String  | Expand nested relations up to 6 levels. Example: `expand=relField1,relField2.subRelField`.    | None    |
| `fields`       | String  | Specify which fields to include in the response. Example: `fields=*,expand.relField.name`.    | All     |
| `skipTotal`    | Boolean | Skip the total counts query for faster performance.                                           | `false` |

##### Supported Sort Fields

- `@random`
- `id`
- `username`
- `email`
- `emailVisibility`
- `verified`
- `created`
- `updated`
- `name`
- `avatar`

##### Example

```http
GET /api/collections/users/records?page=1&perPage=10&sort=-created&filter=(verified=true)&expand=profile
```

---

#### **GET** `/api/collections/:collectionName/records/:id`

Retrieve a single record by its ID.

##### Path Parameters

| Parameter        | Type   | Description                   |
|------------------|--------|-------------------------------|
| `collectionName` | String | The name of the collection.   |
| `id`             | String | The ID of the record.         |

##### Example

```http
GET /api/collections/users/records/12345
```

---

#### **POST** `/api/collections/:collectionName/records`

Create a new record in a collection.

##### Path Parameters

| Parameter        | Type   | Description                   |
|------------------|--------|-------------------------------|
| `collectionName` | String | The name of the collection.   |

##### Body

Send a JSON object containing the data for the new record.

##### Example

```http
POST /api/collections/users/records
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "verified": true
}
```

---

#### **PATCH** `/api/collections/:collectionName/records/:id`

Update an existing record in a collection.

##### Path Parameters

| Parameter        | Type   | Description                   |
|------------------|--------|-------------------------------|
| `collectionName` | String | The name of the collection.   |
| `id`             | String | The ID of the record.         |

##### Body

Send a JSON object containing the fields to update.

##### Example

```http
PATCH /api/collections/users/records/12345
Content-Type: application/json

{
    "username": "john_updated"
}
```

---

#### **DELETE** `/api/collections/:collectionName/records/:id`

Delete a record from a collection by its ID.

##### Path Parameters

| Parameter        | Type   | Description                   |
|------------------|--------|-------------------------------|
| `collectionName` | String | The name of the collection.   |
| `id`             | String | The ID of the record.         |

##### Example

```http
DELETE /api/collections/users/records/12345
```

---

### Query Parameters in Detail

#### **Pagination**

- `page`: Specifies the current page number (default: 1).
- `perPage`: Specifies the number of records per page (default: 30).

#### **Sorting**

Use the `sort` parameter to sort records by attributes. Prefix with `-` for DESC or leave it empty for ASC.

##### Example:
```http
?sort=-created,id
```

#### **Filtering**

Use the `filter` parameter to filter records using logical operators.

##### Example:
```http
?filter=(id='12345' && verified=true)
```

#### **Expanding Relations**

Use the `expand` parameter to include related fields.

##### Example:
```http
?expand=profile,profile.address
```

#### **Field Selection**

Use the `fields` parameter to specify which fields to return.

##### Example:
```http
?fields=*,profile.name,profile.email
```

#### **Skip Total**

Set `skipTotal=true` to speed up queries by skipping total count calculations. This is ideal for cursor-based pagination.

### Notes

- All endpoints adhere to JWT-based authentication.
- Use `expand` with caution for deep relations to prevent performance issues.


## Requirements

- Your backend must follow PocketBase's request mapping structure and must implement filtering, expanding, and pagination that aligns with this library [API References](#-api-reference)
- Use only JWT-based authentication

## Why Use PocketBase API Wrapper?

1. Saves development time by handling common API tasks.
2. Reduces the need for repetitive code.
3. No need to integrate additional HTTP or WebSocket libraries.
4. Lightweight and easy to integrate.

## Contributions

Contributions are very much welcome! Feel free to open issues or submit pull requests

## Acknowledgments

Inspired by the [PocketBase](https://github.com/pocketbase/pocketbase) ecosystem. Special thanks to developers who value simplicity and efficiency.