import pool from "../config/db.js";

/**
 * Fungsi untuk mendeteksi user yang melanggar
 * - Jika sudah gate_in lebih dari 10 menit tapi belum parkir
 * - Maka tambahkan ke tabel pelanggaran
 */
export const detectAndInsertPelanggaran = async () => {
    const client = await pool.connect();
    try {
        console.log("🔍 Mengecek pelanggaran parkir sembarangan...");

        // Ambil semua user yang terakhir kali gate_in (entered)
        const result = await client.query(`
      SELECT DISTINCT ON (id)
        id AS userid,
        time AS waktu_masuk
      FROM log_activity
      WHERE status = 'entered'
      ORDER BY id, time DESC
    `);

        const now = new Date();

        for (const row of result.rows) {
            const { userid, waktu_masuk } = row;
            const masuk = new Date(waktu_masuk);
            const selisihMenit = (now - masuk) / (1000 * 60);

            // Jika lebih dari 10 menit sejak gate_in
            if (selisihMenit > 10) {
                // Cek apakah user sudah parkir
                const parked = await client.query(
                    `SELECT 1 FROM log_activity 
           WHERE id = $1 AND status = 'parking' 
           AND time > $2 LIMIT 1`,
                    [userid, waktu_masuk]
                );

                if (parked.rows.length === 0) {
                    // Cek apakah pelanggaran sudah tercatat
                    const exist = await client.query(
                        `SELECT 1 FROM pelanggaran 
             WHERE userid = $1 AND jenis_pelanggaran = 'Parkir sembarangan' 
             AND DATE(created_at) = CURRENT_DATE`,
                        [userid]
                    );

                    if (exist.rows.length === 0) {
                        // Tambahkan pelanggaran baru
                        await client.query(
                            `INSERT INTO pelanggaran (userid, jenis_pelanggaran, nomor)
               VALUES ($1, 'Parkir sembarangan', NULL)`,
                            [userid]
                        );
                        console.log(`⚠️ Pelanggaran ditambahkan untuk user ${userid}`);
                    }
                }
            }
        }

        console.log("✅ Pemeriksaan pelanggaran selesai");
    } catch (err) {
        console.error("❌ Error saat mendeteksi pelanggaran:", err);
    } finally {
        client.release();
    }
};
