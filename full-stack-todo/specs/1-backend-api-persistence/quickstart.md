# Backend API Quickstart Guide

**Feature**: Backend API & Data Persistence
**Date**: 2026-02-08
**Version**: 1.0.0

## Overview

This guide will help you set up and run the Backend API for the Todo application. The backend provides a secure RESTful API with JWT authentication and PostgreSQL data persistence.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+**: [Download Python](https://www.python.org/downloads/)
- **pip**: Python package manager (included with Python)
- **Git**: For cloning the repository
- **PostgreSQL Client** (optional): For database debugging

### External Services Required

- **Neon PostgreSQL Database**: Sign up at [neon.tech](https://neon.tech) and create a database
- **Better Auth System**: Must be configured to issue JWT tokens with user_id claim

## Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd full-stack-todo
```

### 2. Set Up Python Environment

Create and activate a virtual environment:

**On Windows**:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux**:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Configuration
JWT_SECRET=your-shared-secret-from-better-auth
JWT_ALGORITHM=HS256

# Environment
ENVIRONMENT=development
```

**Important**:
- `DATABASE_URL`: Get this from your Neon PostgreSQL dashboard
- `JWT_SECRET`: Must match `BETTER_AUTH_SECRET` from your auth system
- Never commit `.env` to version control

### 5. Initialize Database

Run the database initialization script:

```bash
python -m backend.src.database.init_db
```

This creates the necessary tables and indexes.

### 6. Start the Server

```bash
uvicorn backend.src.main:app --reload
```

The API will be available at `http://localhost:8000`

### 7. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T10:30:00Z"
}
```

## Detailed Setup

### Installing Python Dependencies

The `requirements.txt` file includes:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlmodel==0.0.14
psycopg2-binary==2.9.9
pyjwt==2.8.0
python-dotenv==1.0.0
pydantic==2.5.0
```

Install with:
```bash
pip install -r requirements.txt
```

### Database Setup

#### Option 1: Neon PostgreSQL (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to `.env` as `DATABASE_URL`

Example connection string:
```
postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
```

#### Option 2: Local PostgreSQL

If you prefer local development:

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE todo_db;
   ```
3. Set `DATABASE_URL`:
   ```
   postgresql://localhost:5432/todo_db
   ```

### JWT Configuration

The backend verifies JWT tokens issued by Better Auth. Ensure:

1. Better Auth is configured to issue JWT tokens
2. JWT tokens include `sub` or `user_id` claim
3. `JWT_SECRET` in backend matches `BETTER_AUTH_SECRET` in auth system
4. Algorithm is HS256 (default)

### Running the Server

#### Development Mode (with auto-reload)

```bash
uvicorn backend.src.main:app --reload --host 0.0.0.0 --port 8000
```

Options:
- `--reload`: Auto-restart on code changes
- `--host 0.0.0.0`: Accept connections from any IP
- `--port 8000`: Port number (default: 8000)

#### Production Mode

```bash
uvicorn backend.src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Options:
- `--workers 4`: Run 4 worker processes
- No `--reload`: Stable for production

## Testing the API

### Get a JWT Token

First, obtain a JWT token from your authentication system:

```bash
# Example: Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

Save the token from the response.

### Make API Requests

Set your token as an environment variable:

```bash
export JWT_TOKEN="your_jwt_token_here"
```

#### Create a Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first task",
    "description": "Testing the API"
  }'
```

#### List Tasks

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Get Specific Task

```bash
curl -X GET http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Update Task

```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task",
    "completed": true
  }'
```

#### Toggle Completion

```bash
curl -X PATCH http://localhost:8000/api/tasks/1/complete \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Delete Task

```bash
curl -X DELETE http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## Interactive API Documentation

FastAPI provides automatic interactive documentation:

### Swagger UI

Visit `http://localhost:8000/docs` in your browser for:
- Interactive API testing
- Request/response examples
- Schema documentation

### ReDoc

Visit `http://localhost:8000/redoc` for:
- Clean, readable documentation
- Detailed schema information
- Code examples

## Project Structure

```
backend/
├── src/
│   ├── main.py                    # FastAPI application entry point
│   ├── config.py                  # Environment configuration
│   ├── database/
│   │   ├── __init__.py
│   │   ├── connection.py          # Database connection
│   │   └── init_db.py             # Database initialization
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py                # Task model
│   │   └── user.py                # User reference model
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── jwt_auth.py            # JWT authentication
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py        # Task business logic
│   └── api/
│       ├── __init__.py
│       └── task_router.py         # Task endpoints
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # Pytest fixtures
│   ├── unit/
│   ├── integration/
│   └── contract/
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
├── .env                           # Your configuration (not in git)
└── README.md                      # Backend documentation
```

## Development Workflow

### 1. Make Code Changes

Edit files in `backend/src/`

### 2. Server Auto-Reloads

If running with `--reload`, changes are automatically detected

### 3. Test Your Changes

```bash
# Run tests
pytest

# Run specific test file
pytest tests/unit/test_task_service.py

# Run with coverage
pytest --cov=backend.src
```

### 4. Check Code Quality

```bash
# Format code
black backend/src

# Check types
mypy backend/src

# Lint code
flake8 backend/src
```

## Common Issues & Solutions

### Issue: "Module not found" Error

**Solution**: Ensure virtual environment is activated and dependencies installed:
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Issue: Database Connection Failed

**Solution**: Check your `DATABASE_URL` in `.env`:
- Verify credentials are correct
- Ensure database exists
- Check network connectivity
- For Neon, verify project is not paused

### Issue: JWT Verification Failed

**Solution**: Verify JWT configuration:
- `JWT_SECRET` matches auth system's `BETTER_AUTH_SECRET`
- Token includes `sub` or `user_id` claim
- Token hasn't expired
- Algorithm is HS256

### Issue: Port Already in Use

**Solution**: Change the port or kill the process:
```bash
# Use different port
uvicorn backend.src.main:app --port 8001

# Or kill process on port 8000 (Linux/Mac)
lsof -ti:8000 | xargs kill -9

# Or kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Issue: CORS Errors from Frontend

**Solution**: Add CORS middleware in `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| JWT_SECRET | Yes | - | Shared secret for JWT verification |
| JWT_ALGORITHM | No | HS256 | JWT signing algorithm |
| ENVIRONMENT | No | development | Environment name (dev/staging/prod) |

## Running Tests

### Install Test Dependencies

```bash
pip install pytest pytest-asyncio pytest-cov httpx
```

### Run All Tests

```bash
pytest
```

### Run Specific Test Types

```bash
# Unit tests only
pytest tests/unit/

# Integration tests only
pytest tests/integration/

# Contract tests only
pytest tests/contract/
```

### Run with Coverage

```bash
pytest --cov=backend.src --cov-report=html
```

View coverage report: `open htmlcov/index.html`

## Deployment

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/

CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t todo-backend .
docker run -p 8000:8000 --env-file .env todo-backend
```

### Production Checklist

- [ ] Set `ENVIRONMENT=production` in `.env`
- [ ] Use strong `JWT_SECRET` (32+ random characters)
- [ ] Configure production database (not local)
- [ ] Set up HTTPS (via reverse proxy)
- [ ] Enable CORS for production frontend domain
- [ ] Configure logging and monitoring
- [ ] Set up database backups
- [ ] Use multiple workers (`--workers 4`)
- [ ] Set up health check monitoring
- [ ] Configure rate limiting (if needed)

## Next Steps

1. **Read the API Documentation**: See `contracts/endpoints.md` for detailed endpoint documentation
2. **Review Data Models**: See `data-model.md` for database schema
3. **Understand Architecture**: See `plan.md` for implementation details
4. **Run Tests**: Execute test suite to verify setup
5. **Integrate with Frontend**: Connect Next.js frontend to this API

## Getting Help

- **API Documentation**: `contracts/endpoints.md`
- **Data Models**: `data-model.md`
- **Implementation Plan**: `plan.md`
- **Research Decisions**: `research.md`
- **OpenAPI Spec**: `contracts/openapi.yaml`

## Useful Commands

```bash
# Activate virtual environment
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run server (development)
uvicorn backend.src.main:app --reload

# Run tests
pytest

# Format code
black backend/src

# Check types
mypy backend/src

# Generate requirements
pip freeze > requirements.txt

# Deactivate virtual environment
deactivate
```

## Security Notes

- Never commit `.env` file to version control
- Use strong, random `JWT_SECRET` (32+ characters)
- Always use HTTPS in production
- Rotate JWT secrets periodically
- Monitor authentication failures
- Keep dependencies updated (`pip list --outdated`)
- Use environment-specific configurations

## Performance Tips

- Use connection pooling (built into SQLModel)
- Add database indexes on frequently queried fields
- Use async/await for I/O operations
- Consider caching for read-heavy workloads
- Monitor database query performance
- Use multiple workers in production

## Troubleshooting Checklist

If something isn't working:

1. ✓ Virtual environment activated?
2. ✓ Dependencies installed?
3. ✓ `.env` file configured?
4. ✓ Database accessible?
5. ✓ JWT_SECRET matches auth system?
6. ✓ Server running on correct port?
7. ✓ JWT token valid and not expired?
8. ✓ Check server logs for errors

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [JWT.io](https://jwt.io/) - JWT debugger
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)

---

**Ready to start?** Follow the Quick Start section above and you'll be running in 5 minutes!
