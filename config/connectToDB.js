import pool from "./db.js";

const connectToDb = async () => {
  try {
    await pool.connect();
    console.log("Connected to DB!");
  } catch (error) {
    console.log("Error connecting to DB", error.message);
  }
};

export default connectToDb;
