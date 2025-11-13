import pool from "../config/db.js";

export const getAllParking = async () => {
  const result = await pool.query("SELECT * FROM parking ORDER BY nomor ASC");
  return result.rows;
};

export const getParkingById = async (nomor) => {
  const result = await pool.query("SELECT * FROM parking WHERE nomor = $1", [nomor]);
  return result.rows[0];
};

export const createParking = async ({ userid, lokasi, status, rolesUser, slot_id }) => {
  const result = await pool.query(
    `INSERT INTO parking (userid, lokasi, status, "rolesUser", slot_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userid || null, lokasi, status || "available", rolesUser || null, slot_id || null]
  );
  return result.rows[0];
};

export const deleteParking = async (nomor) => {
  const result = await pool.query("DELETE FROM parking WHERE nomor = $1 RETURNING *", [nomor]);
  return result.rows[0];
};

export const updateParking = async ({ nomor, userid, status }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("🚗 Update slot:", nomor, "oleh user:", userid);

    // 🔹 1. Cek apakah user sedang menempati slot lain
    const oldSlotRes = await client.query(
      `SELECT nomor FROM parking WHERE userid = $1 AND nomor != $2`,
      [userid, nomor]
    );

    if (oldSlotRes.rows.length > 0) {
      const oldSlot = oldSlotRes.rows[0].nomor;
      console.log(`♻️ Melepaskan slot lama (${oldSlot}) milik user ${userid}`);

      await client.query(
        `UPDATE parking SET userid = NULL, status = 'available' WHERE nomor = $1`,
        [oldSlot]
      );
    }

    // 🔹 2. Ambil data user
    const userRes = await client.query(
      `SELECT userid, nama, roles FROM "User" WHERE userid=$1`,
      [userid]
    );
    if (userRes.rows.length === 0) throw new Error("User tidak ditemukan");
    const userRow = userRes.rows[0];

    // 🔹 3. Ambil data slot baru
    const slotRes = await client.query(
      `SELECT nomor, lokasi, "rolesUser" FROM parking WHERE nomor = $1`,
      [nomor]
    );
    if (slotRes.rows.length === 0) throw new Error("Slot tidak ditemukan");
    const slot = slotRes.rows[0];

    // 🔹 4. Update slot baru
    const result = await client.query(
      `UPDATE parking
       SET userid = $2, status = $3
       WHERE nomor = $1
       RETURNING *`,
      [nomor, userid, status]
    );

    const updated = result.rows[0];
    console.log(`✅ Slot ${nomor} berhasil diupdate jadi ${status}`);

    // 🔹 5. Deteksi pelanggaran
    if (
      slot.rolesUser &&
      slot.rolesUser.toLowerCase() !== userRow.roles.toLowerCase() &&
      status.toLowerCase() === "occupied"
    ) {
      console.warn(
        `⚠️ Pelanggaran terdeteksi: Slot ${slot.nomor} untuk ${slot.rolesUser}, ` +
        `tapi ${userRow.nama} (${userRow.roles}) mencoba parkir.`
      );

      // Catat ke tabel pelanggaran
      await client.query(
        `INSERT INTO pelanggaran (userid, nomor, jenis_pelanggaran)
         VALUES ($1, $2, $3)`,
        [
          userid,
          nomor,
          `Menggunakan slot khusus ${slot.rolesUser}`,
        ]
      );

      // 🔔 Aktifkan buzzer via API
      const buzzerUrl = process.env.URL_BUZZER;
      try {
        await fetch(buzzerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sensor_id: "1" }),
        });
        console.log("🔔 Buzzer ON dikirim");
      } catch (err) {
        console.error("❌ Gagal memanggil API buzzer:", err.message);
      }
    } else {
      console.log("✅ Tidak ada pelanggaran terdeteksi.");
    }

    await client.query("COMMIT");
    return updated;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error updateParking:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

export const getParkingStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'occupied') AS occupied,
      COUNT(*) FILTER (WHERE status = 'available') AS available
    FROM parking;
  `);

  return result.rows[0];
};
