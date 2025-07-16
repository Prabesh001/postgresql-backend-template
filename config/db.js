//For localhost

// import pg from "pg";
// import dotenv from "dotenv";
// dotenv.config();
// const pool = new pg.Pool({
//   user: "postgres",
//   password: "prabesh",
//   host: "localhost",
//   database: "myapp",
//   port: 5432,
// });
// export default pool;
// _______________________________

//For neon connection string
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
