# PocketRestWrapper Library Documentation

## Overview

**PocketRestWrapper** is a lightweight and flexible library for building RESTful API wrappers following the [PocketBase](https://github.com/pocketbase/pocketbase)-style request mapping. It simplifies the process of creating, updating, retrieving, and deleting data while also supporting authentication, file handling, and WebSocket subscriptions for real-time updates.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Collection Management](#collection-management)
  - [CRUD Operations](#crud-operations)
  - [Authentication](#authentication)
  - [Real-time Subscriptions](#real-time-subscriptions)
  - [File Management](#file-management)
- [Methods](#methods)
  - [Collection](#collection-methods)
  - [Authentication Store](#authentication-store-methods)
  - [CRUD Helper](#crud-helper-functions)
- [Error Handling](#error-handling)
- [Example Usage](#example-usage)
- [License](#license)

---

## Installation

Install the library via npm:

```bash
npm install pocket-rest-wrapper
```

---

## Usage

### Initialization

To use `PocketRestWrapper`, initialize it with your base URL:

```javascript
import PocketRestWrapper from 'pocket-rest-wrapper';

const client = new PocketRestWrapper('https://your-backend-url.com');
```

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
import PocketRestWrapper from 'pocket-rest-wrapper';

const client = new PocketRestWrapper('https://your-backend-url.com');
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