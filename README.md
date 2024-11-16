# Pocket REST Wrapper

**Pocket REST Wrapper** is an NPM library designed to simplify API interactions through a structured and consistent way to perform CRUD operations and authentication with minimal effort. It is totally inspired by [PocketBase](https://github.com/pocketbase/pocketbase)'s amazingly simple request mapping. It eliminates the need to manually design and call APIs, letting the developers focus on fast development.

While doing academic projects, I found it wasting to think on how to map the API requests every time I made some application. PocketBase's simplified mapping and fetching got me really fascinated. So, I thought why not just implement a REST mapping much like this one and integrate with my backend?

---
#### Note: There are some dissimilarities with the actual PocketBase's original JS library, such as getting file urls, and realtime features. This is because I kept things simple and parallel with my own projects
---

## Table of Contents

1. [Pocket REST Wrapper](#pocket-rest-wrapper)
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
npm install pocket-rest-wrapper
```

## Setup and Usage

### 1. **Backend Setup**

Your backend must follow the request mapping structure show in this documentation to integrate with this library. Refer to this Section: [API Reference](#-api-reference)

### 2. **Import the Library**

```javascript
import PocketRestWrapper from 'pocketbase-api-wrapper';
```

### 3. **Initialize the Client**

```javascript
const client = new PocketRestWrapper('https://your-backend-url.com');
```

### 4. **Usage**

For usage, refer to this documentation: [Pocket Rest Wrapper Documentation](./PocketRestWrapper.md)

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