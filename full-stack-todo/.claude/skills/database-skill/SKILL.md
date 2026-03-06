---
name: database-skill
description: Design and manage relational databases with tables, migrations, and well-structured schemas.
---

# Database Schema Design

## Instructions

1. **Table creation**
   - Define clear table purposes
   - Choose appropriate data types
   - Set primary keys and indexes

2. **Relationships**
   - Design one-to-one, one-to-many, and many-to-many relations
   - Use foreign keys with constraints
   - Enforce referential integrity

3. **Migrations**
   - Create versioned migrations
   - Handle schema changes safely
   - Support rollbacks

4. **Schema design**
   - Normalize data to reduce duplication
   - Balance normalization vs performance
   - Use naming conventions consistently

## Best Practices
- Keep schemas simple and readable
- Avoid over-indexing
- Plan for future changes
- Document schema decisions
- Test migrations before deploying

## Example Structure
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
