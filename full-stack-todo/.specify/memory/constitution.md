<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Modified principles: None (completely new set)
Added sections: Core Principles (6), Security Requirements, Architecture Rules, Development Workflow
Removed sections: Template placeholders
Templates requiring updates:
- .specify/templates/plan-template.md: ✅ Updated
- .specify/templates/spec-template.md: ✅ Updated
- .specify/templates/tasks-template.md: ✅ Updated
- .specify/templates/commands/*.md: ⚠ Pending review
Follow-up TODOs: None
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### Spec-First Development
All implementation must follow approved specifications; no code implementation before complete spec approval; specifications must detail all features, APIs, and interfaces before development begins.

### Security by Design
Security measures must be built into every component from the start; authentication and authorization enforced at every layer; data protection and user privacy as primary concerns.

### User Data Isolation
Each user can only access their own data; strict enforcement of data boundaries; no cross-user data leakage; individual task ownership enforced.

### Reproducible Development
Same inputs produce identical outputs; deterministic builds and deployments; reproducible development environments; consistent behavior across all environments.

### Zero Manual Coding
Implementation must occur only through Claude Code automation; no direct code editing by humans; all changes must be traceable to specifications.

### API-Centric Architecture
Clear separation between frontend and backend via well-defined APIs; all communication happens through explicitly defined endpoints; RESTful design patterns enforced.

## Security Requirements

All API endpoints require valid JWT authentication tokens; JWT tokens must be verified through FastAPI middleware; user ID from JWT must match the requested resource owner; unauthorized access attempts return 401 status codes; database operations must enforce task ownership and user isolation; no session-based authentication allowed; direct database access from frontend prohibited.

## Architecture Rules

Frontend must use Next.js 16+ with App Router only; Backend must use Python FastAPI framework; ORM layer must use SQLModel for database operations; Database must use Neon Serverless PostgreSQL; Authentication must implement Better Auth with JWT enabled; Shared JWT secret must be configured via BETTER_AUTH_SECRET environment variable; All technology stack decisions must follow the specified requirements.

## Development Workflow

All features must map directly to stated requirements; Every API endpoint must be explicitly specified before implementation; REST APIs must follow standard HTTP semantics; Frontend and backend must communicate only via defined APIs; Implementation follows strict Spec → Plan → Tasks → Implementation workflow; No manual code edits outside of Claude Code automation; All 5 Basic Level Todo features must be implemented with multi-user support.

## Governance

This constitution governs all development activities; amendments require explicit documentation and approval; all pull requests and reviews must verify constitution compliance; complexity must be justified against stated principles; development must follow the defined quality standards for clean separation, reusable components, clear error handling, mobile-responsive UI, and consistent naming.

**Version**: 1.1.0 | **Ratified**: 2026-02-05 | **Last Amended**: 2026-02-05