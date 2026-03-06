# Quickstart Guide: Todo Full-Stack Web Application

**Feature**: 1-todo-full-stack
**Date**: 2026-02-05

## Development Setup

### Prerequisites
- Node.js 18+ (for Next.js frontend)
- Python 3.11+ (for FastAPI backend)
- PostgreSQL database (Neon Serverless recommended)
- Better Auth compatible environment

### Environment Variables
Create `.env` files for both frontend and backend:

**Backend (.env)**:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your_jwt_secret_here
BETTER_AUTH_URL=http://localhost:3000
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Installation & Running

1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m alembic upgrade head  # Run database migrations
   python -m uvicorn src.main:app --reload --port 8000
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Backend docs: http://localhost:8000/docs

## Key Features Walkthrough

### 1. Authentication Flow
1. User navigates to `/auth/signup` to create an account
2. Better Auth handles registration and JWT issuance
3. JWT is stored securely (HTTP-only cookie or secure localStorage)
4. Subsequent API requests include JWT in Authorization header
5. FastAPI middleware validates JWT and extracts user info

### 2. Task Management
1. Authenticated users access `/tasks` to view their tasks
2. Create new tasks via form submission to POST `/api/tasks`
3. Update tasks via PUT `/api/tasks/{id}`
4. Toggle completion via PATCH `/api/tasks/{id}/toggle`
5. Delete tasks via DELETE `/api/tasks/{id}`

### 3. Data Isolation
- All API endpoints verify JWT user ID matches requested resource owner
- Database queries are filtered by authenticated user ID
- Users cannot access other users' tasks

## Architecture Overview

```
┌─────────────┐    HTTP    ┌─────────────┐    DB Query    ┌─────────────────┐
│   Browser   │ ────────►  │  FastAPI    │ ────────────►  │ PostgreSQL      │
│ (Next.js)   │ ◄────────  │   Backend   │ ◄────────────  │ (Neon)          │
└─────────────┘   JWT      └─────────────┘    Filtered    └─────────────────┘
     │                       │   │
     │ API Calls              │   │ JWT Validation
     │ ◄───────────────────── │   │ Middleware
     │                        │   │
     └─── Better Auth ────────┘
```

## Testing the Application

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm run test
```

### End-to-End Testing
```bash
# With both services running
npm run test:e2e
```

## Troubleshooting

**Common Issues**:
- JWT validation failing: Check that `BETTER_AUTH_SECRET` matches between frontend and backend
- Database connection errors: Verify `DATABASE_URL` is correct
- CORS issues: Ensure frontend and backend URLs are properly configured
- Task access issues: Confirm JWT contains correct user ID

**Debugging Authentication**:
- Check browser developer tools for JWT in requests
- Verify JWT payload contains expected user information
- Confirm FastAPI middleware receives and validates JWT properly