import pool from "../config/db.js";

const getUser = async ({ id }) => {
  const res = await pool.query(`
    SELECT * FROM users WHERE id = ${id}
    `);

  return res;
};

export { getUser };
