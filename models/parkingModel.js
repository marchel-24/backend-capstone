import pool from "../config/db.js";

export const getAllParking = async () => {
  const result = await pool.query("SELECT * FROM parking");
  console.log("Result:", result.rows);
  return result.rows;
};

export const getParkingById = async (nomor) => {
  const result = await pool.query("SELECT * FROM parking WHERE nomor = $1", [nomor]);
  return result.rows[0];
};

export const createParking = async ({ userid, lokasi, status }) => {
  const result = await pool.query(
    "INSERT INTO parking (userid, lokasi, status) VALUES ($1, $2, $3) RETURNING *",
    [userid, lokasi, status]
  );
  return result.rows[0];
};

export const deleteParking = async (nomor) => {
  const result = await pool.query("DELETE FROM parking WHERE nomor = $1 RETURNING *", [nomor]);
  return result.rows[0];
};

export const updateParking = async ({ nomor, userid, status }) => {
  const result = await pool.query(
    "UPDATE public.parking SET userid=$2, status=$3 WHERE nomor=$1 RETURNING *",
    [nomor, userid, status]
  );

  console.log("Query params:", [nomor, userid, status]);
  console.log("Result:", result.rows);

  return result.rows[0];
};
