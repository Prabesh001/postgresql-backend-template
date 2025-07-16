
# PostgreSQL Setup for Node.js

This guide shows how to set up a PostgreSQL backend in Node.js using both **localhost** and **cloud connection string** setups. Includes copy-paste–ready snippets.

---

## 📦 Required NPM Packages

Install the following packages:

```bash
npm init -y
npm install express pg cors dotenv
npm install --save-dev nodemon
```

Update your `package.json`:

```json
"type":"module",
"scripts": {
  "start": "nodemon index.js",
  "dev": "nodemon index.js"
}
```

---

## 📁 Folder Structure

```
project-root/
│
├── config/
│   ├── connectToDB.js     # DB connection tester
│   └── db.js              # PostgreSQL pool setup
│
├── .env                   # Environment variables
├── index.js               # Entry point
├── package.json
└── package-lock.json
```

---

## 📚 Table of Contents

- [🔌 Localhost Setup](#localhost-setup)
- [☁️ Connection String Setup](#connection-string-setup)
- [🧠 Database Connector File](#configdbjs)
- [🚀 Express Server Setup](#indexjs)
- [🔐 Environment Variables (.env)](#env)

---

## 🔌 Localhost Setup

📄 `config/db.js`

```js
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({
  user: "postgres",
  password: "prabesh",
  host: "localhost",
  database: "myapp",
  port: 5432,
});

export default pool;
```

---

## ☁️ Connection String Setup

📄 `config/db.js` (for cloud DB providers like Render, Neon, Railway)

```js
import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
```

---

## 🧠 config/connectToDB.js

📄 `config/connectToDB.js` — Handles DB connection startup

```js
import pool from "./db.js";

const connectToDb = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to DB!");
  } catch (error) {
    console.log("❌ Error connecting to DB:", error.message);
  }
};

export default connectToDb;
```

---

## 🚀 index.js

📄 `index.js` — Main entry point for the server

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDb from "./config/connectToDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

---

## 🔐 .env

📄 `.env` — Add at the root of your project

```env
PORT=5000

# Localhost PostgreSQL
PGUSER=postgres
PGPASSWORD=yourpassword
PGHOST=localhost
PGPORT=5432
PGDATABASE=myapp

# Cloud connection string (comment localhost ones if using this)
DATABASE_URL=your_postgres_connection_string
```

---

✅ Now you're ready to run:

```bash
npm start
```

Now you are good to go!👍🎉
