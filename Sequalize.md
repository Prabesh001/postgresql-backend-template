# 🐘 Sequelize for Mongoose Users — Step-by-Step Guide (PostgreSQL)

This guide helps Mongoose users transition into using **Sequelize** with PostgreSQL. It includes direct comparisons, hands-on setup, and relationship examples.

---

## 📦 Step 1: Setup & Installation

### Initialize Project

```bash
mkdir sequelize-app
cd sequelize-app
npm init -y
```

### Install Required Packages

```bash
npm install express sequelize pg pg-hstore dotenv
```

> 🔁 Sequelize = ORM for SQL (like Mongoose is for MongoDB)

---

## 🌐 Step 2: Connecting to PostgreSQL

### Create a `.env` file

```
DB_URL=postgres://username:password@localhost:5432/mydb
```

### Sequelize Connection (`db.js`)

```js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: process.env.DB_URL.includes("neon")
      ? { require: true, rejectUnauthorized: false }
      : undefined,
  },
  logging: false,
});

export default sequelize;
```

> 🧠 Mongoose: `mongoose.connect(uri)`  
> 🔁 Sequelize: `new Sequelize(uri)`

---

## 🧱 Step 3: Define Schema (Model)

### User Model (`models/User.js`)

```js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
});

export default User;
```

> 🧠 Mongoose: `const schema = new Schema({...})`  
> 🔁 Sequelize: `sequelize.define('ModelName', {...})`

---

## 🛣️ Step 4: Create Routes & Server

### Express Server (`server.js`)

```js
import express from "express";
import sequelize from "./db.js";
import User from "./models/User.js";

const app = express();
app.use(express.json());

// Sync DB
await sequelize.sync();

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

> 🧠 Mongoose: `Model.find()`, `Model.create()`  
> 🔁 Sequelize: `Model.findAll()`, `Model.create()`

---

## 🔁 Step 5: CRUD Methods Comparison

| Task         | Mongoose                   | Sequelize                                     |
| ------------ | -------------------------- | --------------------------------------------- |
| Find All     | `Model.find()`             | `Model.findAll()`                             |
| Find One     | `Model.findOne({ email })` | `Model.findOne({ where: { email } })`         |
| Find by ID   | `Model.findById(id)`       | `Model.findByPk(id)`                          |
| Create       | `Model.create(data)`       | `Model.create(data)`                          |
| Update by ID | `findByIdAndUpdate()`      | `update({},{ where: { id } })` or `.update()` |
| Delete by ID | `findByIdAndDelete()`      | `destroy({ where: { id } })`                  |

---

## 🔗 Step 6: Relationships

### Example: One-to-Many (User → Posts)

#### Post Model (`models/Post.js`)

```js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Post = sequelize.define("Post", {
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
});

export default Post;
```

#### Define Relations (`models/index.js` or in `server.js`)

```js
import User from "./User.js";
import Post from "./Post.js";

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });
```

#### Fetch with Join (like `.populate('user')`)

```js
const posts = await Post.findAll({ include: User });
```

> 🧠 Mongoose: `.populate("user")`  
> 🔁 Sequelize: `include: User`

---

## 🧾 Folder Structure (Recommended)

```
/sequelize-app
│
├── models/
│   ├── User.js
│   ├── Post.js
│
├── controllers/
├── routes/
├── db.js
├── server.js
└── .env
```

---

## ✅ Extra Sequelize Features

- `timestamps`, `paranoid`, `scopes`
- hooks: `beforeCreate`, `afterUpdate`, etc.
- support for multiple databases: MySQL, SQLite, etc.
- native SQL query support: `sequelize.query()`

---

## 🔚 Conclusion

- Sequelize is to SQL what Mongoose is to MongoDB.
- It's powerful, and a little more strict, but great for relational data.
- With this guide, you can fully switch from MongoDB to PostgreSQL.

---

## 📖 Official Docs

[https://sequelize.org](https://sequelize.org)
