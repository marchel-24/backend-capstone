import pool from "../config/db.js";

export const getAllLogs = async () => {
  const result = await pool.query("SELECT * FROM log_activity");
  return result.rows;
};

export const getLogById = async (id) => {
  const result = await pool.query("SELECT * FROM log_activity WHERE id = $1", [id]);
  return result.rows;
};

export const createLog = async ({ id, nomor, time, status }) => {
  const result = await pool.query(
    "INSERT INTO log_activity (id, nomor, time, status) VALUES ($1, $2, $3, $4) RETURNING *",
    [id, nomor, time, status]
  );
  return result.rows[0];
};

export const deleteLog = async (id) => {
  const result = await pool.query("DELETE FROM log_activity WHERE num_activity = $1 RETURNING *", [id]);
  return result.rows[0];
};
