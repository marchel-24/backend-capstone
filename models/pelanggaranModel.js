import pool from "../config/db.js";

export const getAllPelanggaran = async () => {
  const result = await pool.query("SELECT * FROM pelanggaran");
  return result.rows;
};

export const getPelanggaranById = async (id) => {
  const result = await pool.query("SELECT * FROM pelanggaran WHERE num_pelanggaran = $1", [id]);
  return result.rows[0];
};

export const createPelanggaran = async ({ userid, nomor, jenis_pelanggaran }) => {
  const result = await pool.query(
    "INSERT INTO pelanggaran (userid, nomor, jenis_pelanggaran) VALUES ($1, $2, $3) RETURNING *",
    [userid, nomor, jenis_pelanggaran]
  );
  return result.rows[0];
};

export const deletePelanggaran = async (id) => {
  const result = await pool.query("DELETE FROM pelanggaran WHERE num_pelanggaran = $1 RETURNING *", [id]);
  return result.rows[0];
};
