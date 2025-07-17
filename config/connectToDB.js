import pool from "./db.js";

const connectToDb = async () => {
  try {
    await pool.connect();
    const role = "admin";
    const adminFound = await pool.query(
      `
     SELECT * FROM users WHERE role = $1`,
      [role]
    );

    if (adminFound.rows.length < 1) {
      const name = "Prabesh";
      const email = "admin123@gmail.com";
      const password = "admin123";
      await pool.query(
        "INSERT INTO users (name, email,password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, password, role]
      );
      console.log("Admin seeded sucessfully!");
    } else {
      console.log("Admin already seeded!");
    }
    console.log("Connected to DB!");
  } catch (error) {
    console.log("Error connecting to DB", error.message);
  }
};

export default connectToDb;
