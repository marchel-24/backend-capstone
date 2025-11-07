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

// export const updateParking = async ({ nomor, userid, status, rolesUser, slot_id }) => {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     // Update tabel parking
//     const updateResult = await client.query(
//       `UPDATE parking
//        SET userid = $2,
//            status = $3,
//            "rolesUser" = $4,
//            slot_id = $5
//        WHERE nomor = $1
//        RETURNING *`,
//       [nomor, userid || null, status, rolesUser || null, slot_id || null]
//     );

//     const updatedParking = updateResult.rows[0];
//     if (!updatedParking) {
//       await client.query("ROLLBACK");
//       return null;
//     }

//     // 🔹 Tentukan status & area yang masuk ke log_activity
//     let logStatus = "";
//     let logArea = "";

//     switch (status?.toLowerCase()) {
//       case "occupied":
//         logStatus = "parking"; // ini status user
//         logArea = slot_id || updatedParking.slot_id || `S${nomor}`;
//         break;
//       case "available":
//         logStatus = "moving";
//         logArea = "in_area";
//         break;
//       case "exited":
//         logStatus = "exited";
//         logArea = "gate_out";
//         break;
//       case "entered":
//         logStatus = "entered";
//         logArea = "gate_in";
//         break;
//       default:
//         logStatus = status || "unknown";
//         logArea = updatedParking.lokasi || "in_area";
//     }

//     // 🔹 Catat log_activity
//     await client.query(
//       `INSERT INTO log_activity (id, nomor, "time", status, area)
//        VALUES ($1, $2, NOW(), $3, $4)`,
//       [userid || null, nomor, logStatus, logArea]
//     );

//     await client.query("COMMIT");

//     console.log(`✅ Parking updated & log recorded: status=${logStatus}, area=${logArea}`);
//     return updatedParking;
//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error("❌ Error updating parking:", err);
//     throw err;
//   } finally {
//     client.release();
//   }
// };


export const updateParking = async ({ nomor, userid, status }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 🔹 Jika statusnya occupied, periksa apakah user sudah parkir di slot lain
    if (status === "occupied" && userid) {
      const check = await client.query(
        `SELECT nomor, lokasi, status FROM parking 
         WHERE userid = $1 AND status = 'occupied' AND nomor <> $2`,
        [userid, nomor]
      );

      if (check.rows.length > 0) {
        await client.query("ROLLBACK");
        console.warn(`⚠️ User ${userid} sudah parkir di slot ${check.rows[0].nomor}`);
        throw new Error(`User ${userid} sudah menempati slot ${check.rows[0].nomor}`);
      }
    }

    // 🔹 Update data parkir seperti biasa
    const updateResult = await client.query(
      `UPDATE parking
       SET userid = $2, status = $3
       WHERE nomor = $1
       RETURNING *`,
      [nomor, userid || null, status]
    );

    const updated = updateResult.rows[0];
    if (!updated) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query("COMMIT");

    console.log("✅ Parking updated:", updated);
    return updated;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error updateParking:", err.message);
    throw err;
  } finally {
    client.release();
  }
};