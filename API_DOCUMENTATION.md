# Task Management API Documentation

## Overview

The Task Management API is a RESTful service built with Clean Architecture and Domain-Driven Design principles. It provides endpoints for managing tasks with support for due dates, status tracking, and automatic notifications.

**Base URL:** `http://localhost:3000`

**API Version:** 1.0.0

**Interactive Documentation:** `http://localhost:3000/swagger`

---

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Create Task](#1-create-task)
  - [Get All Tasks](#2-get-all-tasks)
  - [Get Task by ID](#3-get-task-by-id)
  - [Update Task](#4-update-task)
  - [Delete Task](#5-delete-task)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Notifications](#notifications)
- [Examples](#examples)

---

## Authentication

Currently, the API does not require authentication. This can be added in future versions.

---

## Endpoints

### 1. Create Task

Creates a new task with the provided details. If the due date is within 24 hours, a notification will be automatically queued.

**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "dueDate": "2024-12-25T12:00:00Z"
}
```

**Request Schema:**
- `title` (string, required): Task title (1-255 characters)
- `description` (string, optional): Task description (max 1000 characters)
- `dueDate` (string, optional): ISO 8601 datetime string (e.g., "2024-12-25T12:00:00Z")

**Response:** `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "dueDate": "2024-12-25T12:00:00Z",
  "status": "pending",
  "createdAt": "2024-12-20T10:30:00Z",
  "updatedAt": "2024-12-20T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation error (e.g., invalid date format, missing required field)

**Example:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "dueDate": "2024-12-25T12:00:00Z"
  }'
```

---

### 2. Get All Tasks

Retrieves all tasks. Optionally filter by status.

**Endpoint:** `GET /tasks`

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending` or `completed`)

**Response:** `200 OK`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "dueDate": "2024-12-25T12:00:00Z",
    "status": "pending",
    "createdAt": "2024-12-20T10:30:00Z",
    "updatedAt": "2024-12-20T10:30:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Review code",
    "description": null,
    "dueDate": null,
    "status": "completed",
    "createdAt": "2024-12-19T08:00:00Z",
    "updatedAt": "2024-12-19T15:30:00Z"
  }
]
```

**Examples:**
```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get only completed tasks
curl http://localhost:3000/tasks?status=completed

# Get only pending tasks
curl http://localhost:3000/tasks?status=pending
```

---

### 3. Get Task by ID

Retrieves a specific task by its unique identifier.

**Endpoint:** `GET /tasks/:id`

**Path Parameters:**
- `id` (string, required): Task UUID

**Response:** `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "dueDate": "2024-12-25T12:00:00Z",
  "status": "pending",
  "createdAt": "2024-12-20T10:30:00Z",
  "updatedAt": "2024-12-20T10:30:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Task with the specified ID does not exist

**Example:**
```bash
curl http://localhost:3000/tasks/550e8400-e29b-41d4-a716-446655440000
```

---

### 4. Update Task

Updates an existing task. All fields are optional. Only provided fields will be updated.

**Endpoint:** `PUT /tasks/:id`

**Path Parameters:**
- `id` (string, required): Task UUID

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "dueDate": "2024-12-26T18:00:00Z",
  "status": "completed"
}
```

**Request Schema:**
- `title` (string, optional): Task title (1-255 characters)
- `description` (string, optional): Task description (max 1000 characters). Can be set to `null`.
- `dueDate` (string, optional): ISO 8601 datetime string. Can be set to `null`.
- `status` (string, optional): Task status (`pending` or `completed`)

**Response:** `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated task title",
  "description": "Updated description",
  "dueDate": "2024-12-26T18:00:00Z",
  "status": "completed",
  "createdAt": "2024-12-20T10:30:00Z",
  "updatedAt": "2024-12-20T14:45:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
- `404 Not Found`: Task with the specified ID does not exist

**Example:**
```bash
curl -X PUT http://localhost:3000/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

---

### 5. Delete Task

Deletes a task by its unique identifier.

**Endpoint:** `DELETE /tasks/:id`

**Path Parameters:**
- `id` (string, required): Task UUID

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found`: Task with the specified ID does not exist

**Example:**
```bash
curl -X DELETE http://localhost:3000/tasks/550e8400-e29b-41d4-a716-446655440000
```

---

## Data Models

### Task Object

```typescript
{
  id: string;              // UUID, auto-generated
  title: string;           // Required, 1-255 characters
  description: string | null;  // Optional, max 1000 characters
  dueDate: string | null;  // ISO 8601 datetime string, optional
  status: "pending" | "completed";  // Default: "pending"
  createdAt: string;       // ISO 8601 datetime string
  updatedAt: string;       // ISO 8601 datetime string
}
```

### Task Status

- `pending`: Task is not yet completed (default)
- `completed`: Task has been completed

---

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Error Types

#### 400 Bad Request - Validation Error
```json
{
  "error": "Validation Error",
  "message": "Title must be at least 1 character"
}
```

#### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Task with id 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Notifications

### Automatic Notifications

When a task is created or updated with a `dueDate` that is less than 24 hours from the current time, the system automatically:

1. Enqueues a notification via Redis
2. Logs the notification to the console
3. Writes to `logs/notifications.log`

**Notification Format:**
```
[2024-12-25T10:00:00.000Z] Notification: Task "Complete project" (ID: 550e8400-e29b-41d4-a716-446655440000) is due within 24 hours. Due date: 2024-12-25T23:59:59.000Z
```

### Notification Rules

- Only triggers when `dueDate` is set
- Only triggers when `dueDate` is between now and 24 hours from now
- Triggers on both creation and update operations
- Works even if Redis is unavailable (logs to file only)

---

## Examples

### Complete Workflow

```bash
# 1. Create a task
TASK_ID=$(curl -s -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish documentation",
    "description": "Complete the API documentation",
    "dueDate": "2024-12-25T12:00:00Z"
  }' | jq -r '.id')

echo "Created task: $TASK_ID"

# 2. Get all tasks
curl http://localhost:3000/tasks | jq

# 3. Get the specific task
curl http://localhost:3000/tasks/$TASK_ID | jq

# 4. Update the task status
curl -X PUT http://localhost:3000/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}' | jq

# 5. Delete the task
curl -X DELETE http://localhost:3000/tasks/$TASK_ID
```

### Using JavaScript/TypeScript

```typescript
const BASE_URL = 'http://localhost:3000';

// Create task
const createTask = async () => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'New Task',
      description: 'Task description',
      dueDate: '2024-12-25T12:00:00Z'
    })
  });
  return await response.json();
};

// Get all tasks
const getTasks = async (status?: string) => {
  const url = status ? `${BASE_URL}/tasks?status=${status}` : `${BASE_URL}/tasks`;
  const response = await fetch(url);
  return await response.json();
};

// Get task by ID
const getTask = async (id: string) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`);
  return await response.json();
};

// Update task
const updateTask = async (id: string, updates: any) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return await response.json();
};

// Delete task
const deleteTask = async (id: string) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
  return response.status === 204;
};
```

### Using Python

```python
import requests

BASE_URL = 'http://localhost:3000'

# Create task
def create_task(title, description=None, due_date=None):
    response = requests.post(
        f'{BASE_URL}/tasks',
        json={
            'title': title,
            'description': description,
            'dueDate': due_date
        }
    )
    return response.json()

# Get all tasks
def get_tasks(status=None):
    params = {'status': status} if status else {}
    response = requests.get(f'{BASE_URL}/tasks', params=params)
    return response.json()

# Get task by ID
def get_task(task_id):
    response = requests.get(f'{BASE_URL}/tasks/{task_id}')
    return response.json()

# Update task
def update_task(task_id, **updates):
    response = requests.put(
        f'{BASE_URL}/tasks/{task_id}',
        json=updates
    )
    return response.json()

# Delete task
def delete_task(task_id):
    response = requests.delete(f'{BASE_URL}/tasks/{task_id}')
    return response.status_code == 204
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. This can be added in future versions.

---

## Versioning

The API is currently at version 1.0.0. Future versions may introduce breaking changes with proper versioning in the URL path (e.g., `/v1/tasks`, `/v2/tasks`).

---

## Support

For issues, questions, or contributions, please refer to the project repository.

---

## Changelog

### Version 1.0.0
- Initial release
- CRUD operations for tasks
- Status filtering
- Automatic notifications for tasks due within 24 hours
- Swagger/OpenAPI documentation

