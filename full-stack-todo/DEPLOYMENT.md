# Production Deployment Guide

## Overview
This is a full-stack Todo application with:
- **Frontend**: Next.js 16 with React 18, TypeScript, Tailwind CSS
- **Backend**: FastAPI with PostgreSQL, JWT authentication
- **Database**: Neon PostgreSQL (serverless)

## Environment Setup

### Backend (.env)

```bash
# Database Configuration (Required)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# JWT Configuration (Required - use a strong secret in production)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_ALGORITHM=HS256

# CORS Configuration (Required for production)
# Comma-separated list of allowed origins
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Environment
ENVIRONMENT=production
```

### Frontend (.env.local)

```bash
# Backend API URL (Required)
# For production, use your deployed backend URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# For local development
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Local Development

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Make sure to set DATABASE_URL and JWT_SECRET

# Initialize database (optional - tables auto-create on first run)
python -m backend.src.database.init_db

# Start backend server
uvicorn backend.src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local if needed (default works for local dev)

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

## Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Railway/Render (Backend)

#### Backend (Railway/Render)

1. **Create a new project** on Railway or Render
2. **Connect your repository**
3. **Add environment variables**:
   - `DATABASE_URL` (use Neon PostgreSQL)
   - `JWT_SECRET` (generate a secure random string)
   - `CORS_ORIGINS` (your frontend URL)
   - `ENVIRONMENT=production`
4. **Deploy** - the platform will auto-detect Python

Example `railway.json` or `render.yaml`:
```yaml
services:
  - type: web
    name: todo-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn backend.src.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGINS
        sync: false
```

#### Frontend (Vercel)

1. **Push code to GitHub**
2. **Import project** in Vercel
3. **Add environment variable**:
   - `NEXT_PUBLIC_API_URL` = your backend URL
4. **Deploy**

### Option 2: Docker Deployment

#### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/tododb
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGINS=http://localhost:3000
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=tododb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 3: Deploy to Cloud (AWS/GCP/Azure)

#### AWS (ECS + RDS)

1. **Create RDS PostgreSQL instance**
2. **Create ECR repositories** for backend and frontend
3. **Build and push Docker images**
4. **Create ECS cluster and task definitions**
5. **Configure Application Load Balancer**
6. **Set up environment variables in ECS**

#### GCP (Cloud Run + Cloud SQL)

1. **Create Cloud SQL PostgreSQL instance**
2. **Build container images** to Artifact Registry
3. **Deploy to Cloud Run** with Cloud SQL proxy
4. **Configure environment variables**

## Security Best Practices

### Production Checklist

- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS for both frontend and backend
- [ ] Configure CORS with specific domains (not `*`)
- [ ] Use environment variables for all secrets
- [ ] Enable database SSL/TLS connections
- [ ] Set up rate limiting on API endpoints
- [ ] Enable logging and monitoring
- [ ] Regular security updates for dependencies
- [ ] Backup database regularly
- [ ] Use strong password hashing (bcrypt)

### Generate Secure JWT Secret

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

## Monitoring & Logging

### Backend Logs

The backend logs all requests with:
- HTTP method and path
- Response status code
- Request duration

Example log output:
```
INFO: Request: POST /auth/signin
INFO: Response: POST /auth/signin - Status: 200 - Duration: 45.23ms
```

### Health Check Endpoint

```bash
curl https://api.yourdomain.com/health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-03-09T10:00:00Z"
}
```

## Troubleshooting

### Frontend can't connect to backend

1. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
2. Verify backend is running and accessible
3. Check CORS settings in backend `.env`
4. Look for CORS errors in browser console

### Authentication fails

1. Verify `JWT_SECRET` is the same across restarts
2. Check database connection
3. Ensure password meets requirements (min 8 characters)
4. Clear browser localStorage and try again

### Database connection errors

1. Verify `DATABASE_URL` format
2. Check database is accessible
3. Ensure SSL mode is set if required
4. Check firewall rules

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Sign in to existing account

### Tasks (requires authentication)
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle completion

### Health
- `GET /health` - Health check

## Support

For issues or questions:
1. Check the logs in browser console (F12)
2. Check backend logs for errors
3. Verify environment variables are set correctly
4. Test API endpoints directly with curl or Postman
