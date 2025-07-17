import pool from "../config/db.js";

const getUser = async (data) => {
  const res = await pool.query(`
    SELECT * FROM users WHERE id = ${data.id}
    `);

  return res;
};

export { getUser };
