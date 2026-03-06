---
name: auth-skill
description: Implement secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication System Design

## Instructions

1. **User flows**
   - Signup with email/username and password
   - Signin with credential validation
   - Secure logout and session handling

2. **Password security**
   - Hash passwords before storage
   - Use modern algorithms (bcrypt, argon2, or scrypt)
   - Never store plain-text passwords

3. **Token-based authentication**
   - Generate JWT access tokens
   - Set expiration and refresh strategies
   - Protect routes using token validation

4. **Better Auth integration**
   - Configure providers and adapters
   - Connect database models
   - Handle sessions and middleware

## Best Practices
- Validate input on both client and server
- Use HTTPS for all auth requests
- Rotate and expire tokens regularly
- Store secrets in environment variables
- Follow least-privilege access control

## Example Structure
```ts
// Signup
const hashedPassword = await bcrypt.hash(password, 12);
await db.user.create({
  email,
  password: hashedPassword,
});

// Signin
const isValid = await bcrypt.compare(password, user.password);
if (!isValid) throw new Error("Invalid credentials");

// JWT
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);
