# Research & Architectural Decisions

**Feature**: Backend API & Data Persistence
**Date**: 2026-02-08
**Status**: Complete

## Overview

This document captures the research findings and architectural decisions made during the planning phase for the Backend API & Data Persistence feature. All technical unknowns have been resolved and documented below.

## Research Questions & Findings

### 1. JWT Verification Strategy

**Question**: Should JWT verification be implemented as global FastAPI middleware or per-route dependency injection?

**Research Findings**:
- **Global Middleware Approach**: Applies to all routes automatically, simpler setup, but affects health checks and public endpoints
- **Dependency Injection Approach**: More flexible, allows selective protection, better testability, follows FastAPI conventions

**Decision**: Use FastAPI dependency injection for JWT verification

**Rationale**:
- Allows health check endpoint to remain public
- Better testability - can mock dependencies in tests
- More explicit - each route declares its authentication requirement
- Follows FastAPI best practices and idiomatic patterns
- Easier to add public endpoints in the future if needed

**Implementation Pattern**:
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)) -> dict:
    # Verify JWT and extract user_id
    return {"user_id": user_id}

@app.get("/api/tasks")
async def list_tasks(current_user: dict = Depends(get_current_user)):
    # Route is protected, current_user contains user_id
    pass
```

**Alternatives Considered**:
- Global middleware: Rejected due to inflexibility with public endpoints
- Manual token extraction in each route: Rejected due to code duplication

---

### 2. User Identity Source

**Question**: Should user identity come from JWT payload or URL parameter, and how should they be validated?

**Research Findings**:
- **JWT Payload (sub/user_id claim)**: Standard JWT practice, single source of truth, tamper-proof
- **URL Parameter**: Requires validation against JWT, redundant, potential for mismatch errors

**Decision**: Extract user_id from JWT payload only, do not include user_id in URL paths

**Rationale**:
- JWT payload is the authoritative source of user identity
- Eliminates possibility of URL parameter tampering
- Cleaner API design - `/api/tasks` instead of `/api/users/{user_id}/tasks`
- Follows REST best practices - resource ownership implicit from authentication
- Reduces validation complexity - no need to match URL param to JWT claim

**Implementation Pattern**:
```python
# JWT payload structure
{
  "sub": "user_123",  # or "user_id": 123
  "exp": 1234567890,
  "iat": 1234567890
}

# Extract in dependency
def get_current_user(token: str = Depends(security)) -> dict:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    user_id = payload.get("sub") or payload.get("user_id")
    return {"user_id": user_id}
```

**Alternatives Considered**:
- URL parameter with JWT validation: Rejected as redundant and error-prone
- Both JWT and URL with matching requirement: Rejected as unnecessarily complex

---

### 3. Task Ownership Enforcement

**Question**: Should task ownership be enforced at the database query level or service layer?

**Research Findings**:
- **Query-Level Filtering**: Add `WHERE user_id = {authenticated_user}` to all queries
- **Service-Layer Checks**: Retrieve task, then check ownership in Python code
- **Route-Level Checks**: Verify ownership before calling service

**Decision**: Enforce ownership at the database query level (service layer)

**Rationale**:
- Defense in depth - impossible to bypass even if service called incorrectly
- Performance benefit - database filters before returning data
- Consistency - all queries automatically filtered
- Simplicity - single enforcement point
- Security - prevents accidental data leakage

**Implementation Pattern**:
```python
# Service layer - all queries filtered by user_id
def get_tasks(user_id: int, session: Session) -> List[Task]:
    return session.query(Task).filter(Task.user_id == user_id).all()

def get_task_by_id(task_id: int, user_id: int, session: Session) -> Optional[Task]:
    return session.query(Task).filter(
        Task.id == task_id,
        Task.user_id == user_id  # Ownership filter
    ).first()
```

**Alternatives Considered**:
- Service-layer post-query checks: Rejected as less secure and less efficient
- Route-level checks only: Rejected as not defense-in-depth

---

### 4. SQLModel Session Lifecycle Management

**Question**: How should database sessions be created, managed, and cleaned up?

**Research Findings**:
- **Manual Session Management**: Create/close in each route - error-prone
- **Context Managers**: Use `with` statement - better but verbose
- **FastAPI Dependency with Yield**: Automatic cleanup, transaction management

**Decision**: Use FastAPI dependency injection with yield pattern

**Rationale**:
- Automatic session cleanup even on exceptions
- Follows FastAPI best practices
- Supports transaction management
- Clean separation of concerns
- Testable - can inject mock sessions

**Implementation Pattern**:
```python
from sqlmodel import Session, create_engine

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
        # Automatic cleanup after request

@app.get("/api/tasks")
async def list_tasks(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Session automatically cleaned up
    pass
```

**Alternatives Considered**:
- Manual session management: Rejected due to error-proneness
- Global session: Rejected due to concurrency issues

---

### 5. Error Handling Strategy

**Question**: How should errors be structured and returned to clients?

**Research Findings**:
- **Plain Text Errors**: Simple but not machine-readable
- **Structured JSON**: Consistent format, parseable, debuggable
- **Problem Details (RFC 7807)**: Standard format but more complex

**Decision**: Use structured JSON error responses with consistent format

**Rationale**:
- Client-friendly - easy to parse and display
- Debuggable - includes detail and timestamp
- Consistent - same format for all errors
- RESTful - follows API conventions
- Extensible - can add fields as needed

**Implementation Pattern**:
```python
# Error response format
{
  "detail": "Task not found",
  "status_code": 404,
  "timestamp": "2026-02-08T10:30:00Z"
}

# FastAPI exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
    )
```

**Alternatives Considered**:
- Plain text errors: Rejected as not machine-readable
- RFC 7807 Problem Details: Rejected as unnecessarily complex for this use case

---

### 6. HTTP Status Code Conventions

**Question**: Which HTTP status codes should be used for different scenarios?

**Research Findings**:
- RESTful conventions provide standard mappings
- Consistency improves client experience
- Specific codes communicate intent clearly

**Decision**: Follow RESTful HTTP status code conventions

**Status Code Mapping**:
- **200 OK**: Successful GET, PUT, PATCH operations
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE (no response body)
- **400 Bad Request**: Validation failure (empty title, too long, etc.)
- **401 Unauthorized**: Missing, invalid, or expired JWT token
- **403 Forbidden**: Valid JWT but insufficient permissions (wrong user)
- **404 Not Found**: Resource doesn't exist (task ID not found)
- **500 Internal Server Error**: Unexpected server errors

**Rationale**:
- Industry standard conventions
- Clear semantic meaning
- Client libraries understand these codes
- Follows REST best practices

**Implementation Pattern**:
```python
# 201 Created
@app.post("/api/tasks", status_code=201)
async def create_task(...):
    return task

# 204 No Content
@app.delete("/api/tasks/{id}", status_code=204)
async def delete_task(...):
    return None

# 403 Forbidden
if task.user_id != current_user["user_id"]:
    raise HTTPException(status_code=403, detail="Not authorized")

# 404 Not Found
if not task:
    raise HTTPException(status_code=404, detail="Task not found")
```

**Alternatives Considered**:
- Custom status codes: Rejected as non-standard
- Generic 400 for all errors: Rejected as not semantic

---

### 7. API Route Naming and Structure

**Question**: Should routes include user_id in the path or derive it from JWT?

**Research Findings**:
- **With User ID**: `/api/users/{user_id}/tasks` - explicit but redundant
- **Without User ID**: `/api/tasks` - cleaner, user context from JWT

**Decision**: Use `/api/tasks` without user_id in path

**Rationale**:
- User context is implicit from JWT authentication
- Cleaner, more RESTful URLs
- Prevents URL parameter tampering
- Reduces validation complexity
- Follows principle of least surprise

**Route Structure**:
```
GET    /api/tasks              # List user's tasks
POST   /api/tasks              # Create task for user
GET    /api/tasks/{id}         # Get specific task (if owned)
PUT    /api/tasks/{id}         # Update task (if owned)
DELETE /api/tasks/{id}         # Delete task (if owned)
PATCH  /api/tasks/{id}/complete # Toggle completion (if owned)
```

**Rationale for Structure**:
- Standard REST resource naming
- Task ID in path for specific operations
- Sub-resource `/complete` for toggle action
- All operations implicitly scoped to authenticated user

**Alternatives Considered**:
- `/api/users/{user_id}/tasks`: Rejected as redundant with JWT
- `/api/v1/tasks`: Versioning deferred to future if needed

---

## Technology Stack Validation

### FastAPI Framework
**Version**: 0.104+
**Justification**:
- High performance (async/await support)
- Automatic OpenAPI documentation
- Built-in dependency injection
- Excellent type safety with Pydantic
- Large ecosystem and community

### SQLModel ORM
**Version**: 0.0.14+
**Justification**:
- Combines SQLAlchemy and Pydantic
- Type-safe database operations
- Automatic validation
- FastAPI integration
- Simpler than raw SQLAlchemy

### PyJWT Library
**Version**: 2.8+
**Justification**:
- Industry standard JWT implementation
- Supports HS256 algorithm (required for Better Auth)
- Secure token verification
- Expiration handling
- Well-maintained

### Neon PostgreSQL
**Justification**:
- Serverless architecture (auto-scaling)
- PostgreSQL compatibility (standard SQL)
- Connection pooling built-in
- Reliable persistence
- Easy integration

---

## Best Practices Applied

### Security Best Practices
1. **JWT Verification**: Always verify signature before trusting payload
2. **User Isolation**: Filter all queries by authenticated user_id
3. **Input Validation**: Validate all inputs with Pydantic models
4. **Error Messages**: Don't leak sensitive information in errors
5. **HTTPS**: Assume HTTPS termination at load balancer/proxy

### Database Best Practices
1. **Connection Pooling**: Use SQLModel's built-in pooling
2. **Session Management**: Automatic cleanup with dependency injection
3. **Parameterized Queries**: SQLModel prevents SQL injection
4. **Transactions**: Implicit transactions per request
5. **Indexes**: Add indexes on user_id and id columns

### API Design Best Practices
1. **RESTful Conventions**: Standard HTTP methods and status codes
2. **Consistent Responses**: Same format for all endpoints
3. **Error Handling**: Structured error responses
4. **Versioning**: Prepared for future versioning if needed
5. **Documentation**: Automatic OpenAPI generation

### Code Organization Best Practices
1. **Separation of Concerns**: Models, services, routes separated
2. **Dependency Injection**: Loose coupling, testable
3. **Type Hints**: Full type coverage for IDE support
4. **Configuration**: Environment variables for all config
5. **Testing**: Unit, integration, and contract tests

---

## Performance Considerations

### Expected Performance Characteristics
- **Latency**: <200ms p95 for API requests (database query + serialization)
- **Throughput**: 100+ concurrent requests (async FastAPI + connection pooling)
- **Database**: Connection pooling prevents connection exhaustion
- **Memory**: Minimal per-request memory (stateless design)

### Optimization Strategies
1. **Async Operations**: FastAPI async/await for I/O operations
2. **Connection Pooling**: Reuse database connections
3. **Query Optimization**: Index on user_id for fast filtering
4. **Response Caching**: Can add caching layer if needed (future)
5. **Pagination**: Can add pagination for large task lists (future)

---

## Security Considerations

### Threat Model
1. **Unauthorized Access**: Mitigated by JWT verification on all routes
2. **Cross-User Data Access**: Mitigated by query-level filtering
3. **Token Theft**: Mitigated by short expiration, HTTPS
4. **SQL Injection**: Mitigated by SQLModel parameterized queries
5. **DoS Attacks**: Mitigated by rate limiting (future), connection pooling

### Security Controls
1. **Authentication**: JWT verification with shared secret
2. **Authorization**: User ID matching and query filtering
3. **Input Validation**: Pydantic models validate all inputs
4. **Error Handling**: No sensitive data in error messages
5. **Logging**: Authentication failures logged for monitoring

---

## Testing Strategy

### Unit Tests
- JWT verification logic
- Task service methods (with mock database)
- Validation logic
- Error handling

### Integration Tests
- Full API endpoint flows
- Database operations
- Authentication/authorization
- Error scenarios

### Contract Tests
- OpenAPI specification compliance
- Request/response format validation
- Status code verification

### Security Tests
- Authentication bypass attempts
- Cross-user access attempts
- Token manipulation
- SQL injection attempts

---

## Deployment Considerations

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Shared secret for JWT verification
- `JWT_ALGORITHM`: Algorithm (default: HS256)
- `ENVIRONMENT`: dev/staging/prod

### Dependencies
- Python 3.11+ runtime
- PostgreSQL database (Neon)
- Better Auth system (for JWT issuance)

### Monitoring
- Health check endpoint: `/health`
- Authentication failure logging
- Database connection monitoring
- Error rate tracking

---

## Conclusion

All technical unknowns have been resolved through research and architectural decision-making. The chosen approaches prioritize security, maintainability, and adherence to best practices. The implementation is ready to proceed to Phase 1 (Design & Contracts).

**Key Takeaways**:
1. JWT dependency injection provides flexibility and testability
2. Query-level filtering ensures defense-in-depth security
3. Structured error responses improve client experience
4. RESTful conventions provide consistency
5. FastAPI + SQLModel + PostgreSQL is a proven stack

**Next Steps**: Proceed to Phase 1 to create data-model.md, API contracts, and quickstart guide.
