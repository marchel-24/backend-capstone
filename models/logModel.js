import pool from "../config/db.js";

export const getAllLogs = async () => {
  const result = await pool.query(
    `SELECT num_activity, id, nomor, time, status, area
     FROM log_activity
     ORDER BY time DESC`
  );
  return result.rows;
};

export const getLogById = async (id) => {
  const result = await pool.query(
    `SELECT num_activity, id, time, status, area
     FROM log_activity
     WHERE id = $1
     ORDER BY time DESC`,
    [id]
  );
  return result.rows;
};

export const createLog = async ({ id, area, status }) => {
  const result = await pool.query(
    `INSERT INTO log_activity (id, area, status, time)
     VALUES ($1, $2, $3, NOW())
     RETURNING *`,
    [id, area, status]
  );
  return result.rows[0];
};


export const deleteLog = async (id) => {
  const result = await pool.query(
    `DELETE FROM log_activity WHERE num_activity = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
