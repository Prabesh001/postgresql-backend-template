# 📘 General PostgreSQL Queries Guide

This README provides a curated set of **commonly used PostgreSQL queries** for basic CRUD operations, table management, indexing, constraints, and advanced tasks like joins, transactions, and aggregation.

---

## 🧱 TABLE OPERATIONS

### Create Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Drop Table
```sql
DROP TABLE IF EXISTS users;
```

### Alter Table
```sql
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users DROP COLUMN age;
```

---

## 🔄 CRUD OPERATIONS

### INSERT
```sql
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *; -- Parameterized
```

### SELECT
```sql
SELECT * FROM users;
SELECT name, email FROM users WHERE age > 25;
SELECT * FROM users WHERE email = $1; -- Parameterized
```

### UPDATE
```sql
UPDATE users SET name = 'Bob' WHERE id = 1;
UPDATE users SET name = $1 WHERE id = $2 RETURNING *; -- Safer with RETURNING
```

### DELETE
```sql
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE email = $1 RETURNING *;
```

---

## 🔍 FILTERING & SORTING

```sql
SELECT * FROM users WHERE age BETWEEN 18 AND 30 ORDER BY name ASC LIMIT 10 OFFSET 20;
SELECT * FROM users WHERE name ILIKE '%john%'; -- Case-insensitive match
```

---

## 📎 JOINS

```sql
-- INNER JOIN
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

---

## 📊 AGGREGATES & GROUPING

```sql
SELECT COUNT(*) FROM users;
SELECT role, COUNT(*) FROM users GROUP BY role;
SELECT AVG(age) FROM users;
```

---

## 🔐 CONSTRAINTS

```sql
-- Add Unique
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- Add Foreign Key
ALTER TABLE orders ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);
```

---

## ⚡ INDEXING

```sql
CREATE INDEX idx_email ON users(email);
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

---

## 🔁 TRANSACTIONS

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
-- or ROLLBACK;
```

---

## 🔄 UPSERT (Insert or Update)

```sql
INSERT INTO users (email, name)
VALUES ('bob@example.com', 'Bob')
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name;
```

---

## 🔧 JSON & ARRAY Operations

```sql
-- JSON
SELECT data->>'name' FROM users WHERE data->>'status' = 'active';

-- Array
SELECT * FROM users WHERE 'admin' = ANY(roles);
```

---

## ⏱ TIMESTAMP & DATES

```sql
SELECT NOW();
SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days';
```

---

## 📜 VIEWS

```sql
CREATE VIEW active_users AS
SELECT * FROM users WHERE status = 'active';

DROP VIEW IF EXISTS active_users;
```

---

## 🧪 DEBUGGING & UTILITIES

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';
SELECT * FROM pg_indexes WHERE tablename = 'users';
```

---

© 2025 | PostgreSQL Essentials — General Queries