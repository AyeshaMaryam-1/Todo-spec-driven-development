# Frontend Quickstart Guide

**Feature**: Frontend Application & User Experience
**Date**: 2026-02-08
**Version**: 1.0.0

## Overview

This guide will help you set up and run the Next.js 16+ frontend application for the Todo application. The frontend provides user authentication via Better Auth and task management interfaces that communicate with the backend API.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+**: [Download Node.js](https://nodejs.org/)
- **npm or pnpm**: Package manager (npm comes with Node.js)
- **Git**: For cloning the repository
- **Modern browser**: Chrome, Firefox, Safari, or Edge

### External Services Required

- **Backend API**: Must be running on http://localhost:8000 (see Backend API quickstart)
- **Better Auth**: Must be configured with JWT support
- **PostgreSQL Database**: Accessible to backend (via Neon or local)

## Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd full-stack-todo
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-shared-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

**Important**:
- `NEXT_PUBLIC_API_URL`: Backend API base URL (must match backend server)
- `BETTER_AUTH_SECRET`: Must match backend's JWT_SECRET
- `BETTER_AUTH_URL`: Frontend URL for Better Auth callbacks
- Never commit `.env.local` to version control

### 5. Start the Development Server

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### 6. Verify Installation

1. Open browser to `http://localhost:3000`
2. You should see the landing page or be redirected to signin
3. Backend API must be running for full functionality

## Detailed Setup

### Installing Dependencies

The `package.json` includes:

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "better-auth": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^16.0.0"
  }
}
```

Install with:
```bash
npm install
```

### Better Auth Configuration

Better Auth must be configured to issue JWT tokens with user_id claim.

Create `lib/auth.ts`:

```typescript
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: {
    // Configure database connection
    // This should match your backend database
  },
  session: {
    jwt: {
      enabled: true,
      expiresIn: '7d',
    },
  },
})

export const { signIn, signUp, signOut, useSession } = auth
```

**Important**: JWT secret must match backend's `JWT_SECRET` environment variable.

### Backend API Connection

Ensure the backend API is running:

```bash
# In backend directory
cd ../backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn backend.src.main:app --reload
```

Backend should be accessible at `http://localhost:8000`

Test backend health:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-02-08T10:30:00Z"
}
```

### Running the Development Server

#### Development Mode (with hot reload)

```bash
npm run dev
```

Options:
- Runs on `http://localhost:3000` by default
- Hot module replacement enabled
- TypeScript type checking in real-time
- Tailwind CSS compilation

#### Production Build

```bash
npm run build
npm start
```

Options:
- Optimized production build
- Static optimization where possible
- Image optimization
- Code splitting

#### Type Checking

```bash
npm run type-check
```

#### Linting

```bash
npm run lint
```

## Testing the Application

### Manual Testing Flow

1. **Signup Flow**:
   ```
   1. Navigate to http://localhost:3000/signup
   2. Enter email and password
   3. Click "Sign Up"
   4. Should redirect to dashboard
   ```

2. **Signin Flow**:
   ```
   1. Navigate to http://localhost:3000/signin
   2. Enter existing credentials
   3. Click "Sign In"
   4. Should redirect to dashboard
   ```

3. **Task Management**:
   ```
   1. On dashboard, click "Create Task"
   2. Enter title and optional description
   3. Click "Save"
   4. Task should appear in list
   5. Click checkbox to toggle completion
   6. Click edit icon to modify task
   7. Click delete icon to remove task
   ```

4. **Session Persistence**:
   ```
   1. Sign in
   2. Refresh page (F5)
   3. Should remain signed in
   4. Close browser and reopen
   5. Should remain signed in (until expiration)
   ```

5. **Route Protection**:
   ```
   1. Sign out
   2. Try to access http://localhost:3000/dashboard
   3. Should redirect to /signin
   ```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Public auth pages
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── (protected)/       # Protected pages
│   │   │   └── dashboard/
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── auth/             # Auth components
│   │   ├── tasks/            # Task components
│   │   ├── ui/               # UI components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Utilities
│   │   ├── api-client.ts     # API client
│   │   ├── auth.ts           # Better Auth config
│   │   └── utils.ts          # Helpers
│   ├── types/                 # TypeScript types
│   └── styles/                # Global styles
├── public/                    # Static assets
├── tests/                     # Test files
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── .env.local.example
```

## Development Workflow

### 1. Create a New Component

```bash
# Create component file
touch src/components/tasks/TaskCard.tsx

# Create component test
touch tests/unit/components/TaskCard.test.tsx
```

### 2. Add a New Page

```bash
# Create page in App Router
mkdir -p src/app/new-page
touch src/app/new-page/page.tsx
```

### 3. Add API Endpoint Integration

```typescript
// In lib/api-client.ts
export async function getNewData() {
  return apiClient<NewData>('/api/new-endpoint')
}

// In components
const { data, isLoading } = useQuery({
  queryKey: ['new-data'],
  queryFn: getNewData,
})
```

### 4. Style with Tailwind CSS

```tsx
<div className="container mx-auto px-4">
  <h1 className="text-2xl font-bold mb-4">Title</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click Me
  </button>
</div>
```

## Common Issues & Solutions

### Issue: "Module not found" Error

**Solution**: Ensure dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Backend API Connection Failed

**Solution**: Check backend is running:
```bash
curl http://localhost:8000/health
```

If not running, start backend:
```bash
cd backend
uvicorn backend.src.main:app --reload
```

### Issue: Better Auth Configuration Error

**Solution**: Verify environment variables:
- `BETTER_AUTH_SECRET` matches backend `JWT_SECRET`
- `BETTER_AUTH_URL` is correct
- Database connection is configured

### Issue: Port Already in Use

**Solution**: Change port or kill process:
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Or kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: TypeScript Errors

**Solution**: Check TypeScript configuration:
```bash
npm run type-check
```

Fix errors in `tsconfig.json` if needed.

### Issue: Tailwind CSS Not Working

**Solution**: Ensure Tailwind is configured:
```bash
# Check tailwind.config.js exists
# Check postcss.config.js exists
# Restart dev server
npm run dev
```

### Issue: Session Not Persisting

**Solution**: Check Better Auth configuration:
- JWT enabled in Better Auth config
- Session expiration set correctly
- Cookies not blocked by browser

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | Yes | - | Backend API base URL |
| BETTER_AUTH_SECRET | Yes | - | Shared secret for JWT (must match backend) |
| BETTER_AUTH_URL | Yes | - | Frontend URL for callbacks |
| NODE_ENV | No | development | Environment (development/production) |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **Code Splitting**: Next.js automatically splits code per route
2. **Image Optimization**: Use Next.js `<Image>` component
3. **Lazy Loading**: Use `React.lazy()` for non-critical components
4. **Caching**: React Query caches API responses automatically
5. **Memoization**: Use `useMemo`/`useCallback` for expensive operations

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t todo-frontend .
docker run -p 3000:3000 --env-file .env.local todo-frontend
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production API URL
- [ ] Configure proper CORS on backend
- [ ] Enable HTTPS
- [ ] Set secure session cookies
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up monitoring and analytics
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify route protection
- [ ] Test session expiration handling

## Next Steps

1. **Read the Documentation**: See `plan.md` for architecture details
2. **Review Data Models**: See `data-model.md` for TypeScript types
3. **Understand API Client**: See `contracts/api-client.ts` for API integration
4. **Run Tests**: Execute test suite to verify setup
5. **Start Development**: Begin implementing features per `tasks.md`

## Getting Help

- **API Documentation**: See `contracts/api-client.ts`
- **Data Models**: See `data-model.md`
- **Implementation Plan**: See `plan.md`
- **Research Decisions**: See `research.md`

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler
npm run format           # Format code with Prettier

# Dependencies
npm install              # Install dependencies
npm update               # Update dependencies
npm outdated             # Check for outdated packages
```

## Security Notes

- Never commit `.env.local` to version control
- Use strong, random `BETTER_AUTH_SECRET` (32+ characters)
- Always use HTTPS in production
- Validate all user inputs
- Keep dependencies updated (`npm audit`)
- Use environment-specific configurations

## Troubleshooting Checklist

If something isn't working:

1. ✓ Node.js 18+ installed?
2. ✓ Dependencies installed (`npm install`)?
3. ✓ `.env.local` configured?
4. ✓ Backend API running?
5. ✓ Backend API accessible at configured URL?
6. ✓ `BETTER_AUTH_SECRET` matches backend `JWT_SECRET`?
7. ✓ Browser console shows no errors?
8. ✓ Network tab shows API requests succeeding?

## Additional Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Ready to start?** Follow the Quick Start section above and you'll be running in 5 minutes!
