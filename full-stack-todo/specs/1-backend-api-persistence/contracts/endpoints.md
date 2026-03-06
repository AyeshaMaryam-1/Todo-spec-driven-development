# API Endpoints Documentation

**Feature**: Backend API & Data Persistence
**Date**: 2026-02-08
**Version**: 1.0.0

## Overview

This document provides detailed documentation for all REST API endpoints in the Backend API. All endpoints (except `/health`) require JWT authentication and automatically scope operations to the authenticated user.

## Base URL

- **Local Development**: `http://localhost:8000`
- **Production**: `https://api.example.com`

## Authentication

All endpoints (except `/health`) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The JWT token must:
- Be issued by the Better Auth system
- Contain a `sub` or `user_id` claim with the user's ID
- Be signed with the shared secret (BETTER_AUTH_SECRET)
- Not be expired

## Common Response Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE (no response body) |
| 400 | Bad Request | Validation failure (empty title, too long, etc.) |
| 401 | Unauthorized | Missing, invalid, or expired JWT |
| 403 | Forbidden | Valid JWT but task belongs to different user |
| 404 | Not Found | Task ID doesn't exist |
| 500 | Internal Server Error | Unexpected server error |

## Error Response Format

All errors return a consistent JSON structure:

```json
{
  "detail": "Human-readable error message",
  "status_code": 404,
  "timestamp": "2026-02-08T10:30:00Z"
}
```

---

## Endpoints

### 1. Health Check

**GET /health**

Check if the API is running and healthy.

**Authentication**: Not required

**Request**:
```http
GET /health HTTP/1.1
Host: localhost:8000
```

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T10:30:00Z"
}
```

**Use Cases**:
- Load balancer health checks
- Monitoring systems
- Deployment verification

---

### 2. List Tasks

**GET /api/tasks**

Retrieve all tasks belonging to the authenticated user, ordered by creation date (newest first).

**Authentication**: Required

**Request**:
```http
GET /api/tasks HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
[
  {
    "id": 2,
    "title": "Review pull requests",
    "description": "Review PRs from team members",
    "completed": false,
    "user_id": 123,
    "created_at": "2026-02-08T11:00:00Z",
    "updated_at": "2026-02-08T11:00:00Z"
  },
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "completed": true,
    "user_id": 123,
    "created_at": "2026-02-08T10:30:00Z",
    "updated_at": "2026-02-08T10:45:00Z"
  }
]
```

**Empty List** (200 OK):
```json
[]
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid JWT token
- **500 Internal Server Error**: Database connection failure

**Notes**:
- Returns only tasks where `user_id` matches the authenticated user
- Tasks are ordered by `created_at` descending (newest first)
- Empty array returned if user has no tasks
- No pagination in this version (all tasks returned)

**cURL Example**:
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Create Task

**POST /api/tasks**

Create a new task for the authenticated user.

**Authentication**: Required

**Request**:
```http
POST /api/tasks HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs"
}
```

**Request Body**:
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| title | string | Yes | 1-255 chars, non-empty | Task title |
| description | string | No | Any length | Task description |

**Response** (201 Created):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "completed": false,
  "user_id": 123,
  "created_at": "2026-02-08T10:30:00Z",
  "updated_at": "2026-02-08T10:30:00Z"
}
```

**Error Responses**:
- **400 Bad Request**: Title is empty or exceeds 255 characters
- **401 Unauthorized**: Missing or invalid JWT token
- **500 Internal Server Error**: Database error

**Validation Examples**:

Empty title (400):
```json
{
  "detail": "Title cannot be empty",
  "status_code": 400,
  "timestamp": "2026-02-08T10:30:00Z"
}
```

Title too long (400):
```json
{
  "detail": "Title must be 255 characters or less",
  "status_code": 400,
  "timestamp": "2026-02-08T10:30:00Z"
}
```

**Notes**:
- `user_id` is automatically set from JWT token
- `completed` defaults to `false`
- `id`, `created_at`, and `updated_at` are auto-generated
- Description is optional (can be null or omitted)

**cURL Example**:
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs"
  }'
```

---

### 4. Get Task by ID

**GET /api/tasks/{id}**

Retrieve a specific task by ID if it belongs to the authenticated user.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID (must be positive integer) |

**Request**:
```http
GET /api/tasks/1 HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "completed": false,
  "user_id": 123,
  "created_at": "2026-02-08T10:30:00Z",
  "updated_at": "2026-02-08T10:30:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Task exists but belongs to different user
- **404 Not Found**: Task ID doesn't exist
- **500 Internal Server Error**: Database error

**Error Examples**:

Task not found (404):
```json
{
  "detail": "Task not found",
  "status_code": 404,
  "timestamp": "2026-02-08T10:30:00Z"
}
```

Not authorized (403):
```json
{
  "detail": "Not authorized to access this task",
  "status_code": 403,
  "timestamp": "2026-02-08T10:30:00Z"
}
```

**Notes**:
- Returns 403 if task exists but belongs to different user
- Returns 404 if task doesn't exist at all
- Ownership is verified via `user_id` match with JWT

**cURL Example**:
```bash
curl -X GET http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Update Task

**PUT /api/tasks/{id}**

Update a task's title, description, or completion status.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID (must be positive integer) |

**Request**:
```http
PUT /api/tasks/1 HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Request Body** (all fields optional):
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| title | string | No | 1-255 chars if provided | Updated task title |
| description | string | No | Any length | Updated description |
| completed | boolean | No | true/false | Updated completion status |

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "user_id": 123,
  "created_at": "2026-02-08T10:30:00Z",
  "updated_at": "2026-02-08T10:45:00Z"
}
```

**Error Responses**:
- **400 Bad Request**: Title is empty or exceeds 255 characters
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Task belongs to different user
- **404 Not Found**: Task doesn't exist
- **500 Internal Server Error**: Database error

**Notes**:
- All fields are optional - only provided fields are updated
- `updated_at` is automatically updated
- `user_id` cannot be changed (ownership is immutable)
- Can update multiple fields in one request

**Partial Update Example**:
```json
{
  "completed": true
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "completed": true
  }'
```

---

### 6. Delete Task

**DELETE /api/tasks/{id}**

Permanently delete a task.

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID (must be positive integer) |

**Request**:
```http
DELETE /api/tasks/1 HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (204 No Content):
```
(empty response body)
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Task belongs to different user
- **404 Not Found**: Task doesn't exist
- **500 Internal Server Error**: Database error

**Notes**:
- Hard delete (task is permanently removed from database)
- No response body on success (204 status code)
- Idempotent - deleting non-existent task returns 404
- Cannot be undone

**cURL Example**:
```bash
curl -X DELETE http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 7. Toggle Task Completion

**PATCH /api/tasks/{id}/complete**

Toggle the completion status of a task (true ↔ false).

**Authentication**: Required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID (must be positive integer) |

**Request**:
```http
PATCH /api/tasks/1/complete HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "completed": true,
  "user_id": 123,
  "created_at": "2026-02-08T10:30:00Z",
  "updated_at": "2026-02-08T10:45:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Task belongs to different user
- **404 Not Found**: Task doesn't exist
- **500 Internal Server Error**: Database error

**Notes**:
- No request body required
- Flips `completed` boolean: `false → true` or `true → false`
- `updated_at` is automatically updated
- Returns the updated task with new completion status

**Behavior**:
- If task is incomplete (`completed: false`), marks it complete (`completed: true`)
- If task is complete (`completed: true`), marks it incomplete (`completed: false`)

**cURL Example**:
```bash
curl -X PATCH http://localhost:8000/api/tasks/1/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Request/Response Examples

### Complete Workflow Example

**1. Create a task**:
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Write tests", "description": "Add unit tests"}'
```

Response:
```json
{
  "id": 5,
  "title": "Write tests",
  "description": "Add unit tests",
  "completed": false,
  "user_id": 123,
  "created_at": "2026-02-08T12:00:00Z",
  "updated_at": "2026-02-08T12:00:00Z"
}
```

**2. List all tasks**:
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**3. Mark task complete**:
```bash
curl -X PATCH http://localhost:8000/api/tasks/5/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**4. Update task details**:
```bash
curl -X PUT http://localhost:8000/api/tasks/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Add unit and integration tests"}'
```

**5. Delete task**:
```bash
curl -X DELETE http://localhost:8000/api/tasks/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Security Considerations

### Authentication
- All endpoints (except `/health`) require valid JWT
- JWT must be in `Authorization: Bearer <token>` header
- Invalid/expired tokens return 401
- Missing tokens return 401

### Authorization
- All operations automatically scoped to authenticated user
- Users cannot access other users' tasks
- Attempting to access another user's task returns 403
- Database queries filtered by `user_id`

### Data Validation
- Title: Required, 1-255 characters, non-empty
- Description: Optional, any length
- Completed: Boolean only (true/false)
- User ID: Cannot be manually set or changed

### Rate Limiting
- Not implemented in this version
- Consider adding in production (e.g., 100 requests/minute per user)

---

## Testing the API

### Using cURL

Set your JWT token as an environment variable:
```bash
export JWT_TOKEN="your_jwt_token_here"
```

Then use it in requests:
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Using Postman

1. Create a new request
2. Set Authorization type to "Bearer Token"
3. Paste your JWT token
4. Make requests to endpoints

### Using Python

```python
import requests

BASE_URL = "http://localhost:8000"
JWT_TOKEN = "your_jwt_token_here"
headers = {"Authorization": f"Bearer {JWT_TOKEN}"}

# List tasks
response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
print(response.json())

# Create task
data = {"title": "New task", "description": "Task description"}
response = requests.post(f"{BASE_URL}/api/tasks", json=data, headers=headers)
print(response.json())
```

---

## Troubleshooting

### 401 Unauthorized
- Check that JWT token is included in Authorization header
- Verify token format: `Bearer <token>`
- Ensure token hasn't expired
- Verify token was issued by correct auth system

### 403 Forbidden
- Task exists but belongs to different user
- Check that user_id in JWT matches task owner
- Verify you're using correct JWT token

### 404 Not Found
- Task ID doesn't exist in database
- Check that task wasn't already deleted
- Verify task ID is correct

### 400 Bad Request
- Check request body format (valid JSON)
- Verify title is not empty
- Ensure title doesn't exceed 255 characters
- Check all required fields are provided

---

## API Versioning

Current version: **1.0.0**

Future versions may be introduced with URL prefix:
- v1: `/api/v1/tasks`
- v2: `/api/v2/tasks`

For now, no version prefix is used (`/api/tasks`).

---

## OpenAPI Specification

The complete OpenAPI 3.0 specification is available at:
- File: `contracts/openapi.yaml`
- Interactive docs (when server running): `http://localhost:8000/docs`
- ReDoc (when server running): `http://localhost:8000/redoc`

---

## Support

For API support or questions:
- Email: support@example.com
- Documentation: See `quickstart.md` for setup instructions
- Issues: Report bugs via project issue tracker
