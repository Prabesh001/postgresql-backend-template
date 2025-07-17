# PostgreSQL Node.js


## ✍️ Basic CRUD Operations Example

Let's add a sample route file with basic CRUD using PostgreSQL.

---

## 📁 Updated Folder Structure

```
project-root/
│
├── config/
│   ├── connectToDB.js     # DB connection tester
│   └── db.js              # PostgreSQL pool setup
│
├── routes/
│   └── users.js           # User CRUD routes
│
├── .env                   # Environment variables
├── index.js               # Entry point
├── package.json
└── package-lock.json
```

---

## 📂 routes/users.js

```js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

---

## 🔁 Update index.js to include routes

```js
import userRoutes from "./routes/users.js";
app.use("/api/users", userRoutes);
```

---

📝 You should also create the `users` table in your database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
```

📝 Or you can also create the `users` and `other table` in your node route:

```js
app.get("/setup", async (req, res) => {
  try {
    const sql = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('admin', 'agent');
        END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role user_role NOT NULL,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        ssn TEXT UNIQUE,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_client CHECK (
          (first_name, last_name, date_of_birth) IS DISTINCT FROM (NULL, NULL, NULL)
        )
    );

    CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        agent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        filename TEXT NOT NULL,
        file_url TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        assigned_to INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        due_date DATE,
        is_completed BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        entity_id INTEGER,
        performed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        change_snapshot JSONB
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        activity TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        details JSONB
    );

    -- Indexes
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_client ON clients(first_name, last_name, date_of_birth);
    CREATE INDEX IF NOT EXISTS idx_clients_name_dob ON clients(first_name, last_name, date_of_birth);
    CREATE INDEX IF NOT EXISTS idx_notes_client ON notes(client_id);
    CREATE INDEX IF NOT EXISTS idx_files_client ON files(client_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_client ON tasks(client_id);
    CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_activity_user_time ON activity_logs(user_id, timestamp);
    `;

    const result = await pool.query(sql);
    res.json({ message: "✅ Tables and schema created successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "❌ Schema setup failed", details: err.message });
  }
});

```

Now you have full CRUD functionality as well as table creation!