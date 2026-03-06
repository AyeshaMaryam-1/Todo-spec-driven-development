---
name: backend-skill
description: Create backend APIs by generating routes, handling requests and responses, and connecting to databases.
---

# Backend API Development

## Instructions

1. **Route creation**
   - Define RESTful routes (GET, POST, PUT, DELETE)
   - Use clear and consistent endpoint naming
   - Group routes by resource

2. **Request & response handling**
   - Parse request parameters and body data
   - Validate user input
   - Send structured JSON responses
   - Handle errors with proper status codes

3. **Database integration**
   - Connect to a database (SQL or NoSQL)
   - Perform CRUD operations
   - Use environment variables for credentials
   - Handle async database operations safely

## Best Practices
- Follow REST API conventions
- Always return proper HTTP status codes
- Keep controllers and routes separate
- Sanitize and validate all inputs
- Use try/catch for error handling
- Never expose sensitive data in responses

## Example Structure
```js
// routes/userRoutes.js
import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", createUser);

export default router;
