import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDb from "./config/connectToDB.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.get("/setup/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // const sql = `INSERT INTO users (name, email, password_hash, role)
    // VALUES ('Roronoa', 'zorosword@wm.com', 'hashed_pw', 'agent')
    // RETURNING *;`;

    // create //
    // const result = await pool.query(
    //   "INSERT INTO users (name, email,password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
    //   [name, email, password, role]
    // );

    // ____________________________________

    // get //
    // const result = await pool.query(
    //   "SELECT * FROM users"
    // );

    // ____________________________________

    // get by id //
    // const result = await pool.query(
    //   "SELECT * FROM users WHERE id = $1",
    //   [id]
    // );

    // ____________________________________

    // delete //
    // const result = await pool.query(
    //   "DELETE FROM users WHERE id = $1 RETURNING *",
    //   [id]
    // );

    // ____________________________________

    // update //
    // const result = await pool.query(
    //   "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    //   [name, email, id]
    // );

    // ____________________________________

    const result = await getUser({ id });

    res.json({
      message: "Tables and schema created successfully.",
      data: result.rows,
      command: result.command,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Schema setup failed", details: err.message });
  }
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
