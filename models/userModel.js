import pool from "../config/db.js";

export const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM "User"');
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM "User" WHERE userid = $1', [id]);
  return result.rows[0];
};

export const createUser = async ({ nama, roles, license }) => {
  const result = await pool.query(
    'INSERT INTO "User" (nama, roles, license) VALUES ($1, $2, $3) RETURNING *',
    [nama, roles, license]
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await pool.query(
    'DELETE FROM "User" WHERE userid = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};
