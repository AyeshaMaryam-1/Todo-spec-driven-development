# Backend API - Todo Application

FastAPI backend with JWT authentication and PostgreSQL data persistence.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

### 3. Initialize Database

```bash
python -m backend.src.database.init_db
```

### 4. Run Server

```bash
uvicorn backend.src.main:app --reload
```

API will be available at `http://localhost:8000`

## Documentation

- **API Docs**: http://localhost:8000/docs
- **Specification**: ../specs/1-backend-api-persistence/spec.md
- **Implementation Plan**: ../specs/1-backend-api-persistence/plan.md
- **Quickstart Guide**: ../specs/1-backend-api-persistence/quickstart.md

## Project Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── database/            # Database connection
│   ├── models/              # SQLModel schemas
│   ├── middleware/          # JWT authentication
│   ├── services/            # Business logic
│   └── api/                 # API endpoints
├── tests/                   # Test suite
├── requirements.txt         # Dependencies
└── .env.example            # Environment template
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| JWT_SECRET | Yes | Shared secret for JWT verification (must match Better Auth) |
| JWT_ALGORITHM | No | JWT algorithm (default: HS256) |
| ENVIRONMENT | No | Environment name (default: development) |

## Testing

```bash
pytest
```

## Authentication

This backend **verifies** JWT tokens issued by Better Auth. It does not handle user signup/signin.

Tokens must include `sub` or `user_id` claim identifying the user.
