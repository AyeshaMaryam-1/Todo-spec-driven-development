# Todo Frontend Application

Next.js 16+ frontend application with Better Auth integration for user authentication and JWT-based API communication.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend API running on http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Technology Stack

- **Next.js 16+** - React framework with App Router
- **TypeScript 5.x** - Type safety
- **Better Auth** - JWT-based authentication
- **React Query 5.x** - Server state management
- **Tailwind CSS 3.x** - Utility-first styling
- **React Hook Form 7.x** - Form handling
- **Zod 3.x** - Schema validation
- **React Hot Toast** - Toast notifications

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Public auth pages
│   │   └── (protected)/       # Protected pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and helpers
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # Global styles
├── public/                    # Static assets
└── tests/                     # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Environment Variables

See `.env.local.example` for required environment variables.

## Documentation

For detailed setup instructions, see `specs/2-frontend-app/quickstart.md`
