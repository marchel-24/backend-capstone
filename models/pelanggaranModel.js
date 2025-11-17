import pool from "../config/db.js";

export const getAllPelanggaran = async () => {
  const result = await pool.query("SELECT * FROM pelanggaran");
  return result.rows;
};

export const getPelanggaranById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM pelanggaran WHERE userid = $1 ORDER BY num_pelanggaran DESC",
    [id]
  );
  return result.rows;
};

export const createPelanggaran = async ({ userid, nomor, jenis_pelanggaran }) => {
  const result = await pool.query(
    "INSERT INTO pelanggaran (userid, nomor, jenis_pelanggaran, time) VALUES ($1, $2, $3, NOW() AT TIME ZONE 'Asia/Jakarta') RETURNING *",
    [userid, nomor, jenis_pelanggaran]
  );
  return result.rows[0];
};

export const deletePelanggaran = async (id) => {
  const result = await pool.query("DELETE FROM pelanggaran WHERE num_pelanggaran = $1 RETURNING *", [id]);
  return result.rows[0];
};
