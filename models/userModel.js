import pool from "../config/db.js";

export const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM "User"');
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM "User" WHERE userid = $1', [id]);
  return result.rows[0];
};

export const createUser = async ({ nama, license, email, birthdate, roles, password }) => {
  const result = await pool.query(
    'INSERT INTO public."User"(nama, roles, license, email, birthdate, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nama, roles, license, email, birthdate, password]
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

export const getUserByMail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM "User" WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const updatepassword = async (email, password) => {
  const result = await pool.query(
    'UPDATE "User" SET password = $2 WHERE email = $1 RETURNING *',
    [email, password]
  );
  return result.rows[0];
}
