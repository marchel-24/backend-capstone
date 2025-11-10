import * as ParkingModel from "../models/parkingModel.js";

export const getParkings = async (req, res) => {
  try {
    const result = await ParkingModel.getAllParking();
    res.json(result);
  } catch (err) {
    console.error("Error getParkings:", err);
    res.status(500).json({ message: "Gagal mengambil data parkir" });
  }
};

export const getParking = async (req, res) => {
  try {
    const parking = await ParkingModel.getParkingById(req.params.id);
    if (!parking) return res.status(404).json({ message: "Parking tidak ditemukan" });
    res.json(parking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const addParking = async (req, res) => {
  try {
    const parking = await ParkingModel.createParking(req.body);
    res.status(201).json(parking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan parkir" });
  }
};

export const removeParking = async (req, res) => {
  try {
    const parking = await ParkingModel.deleteParking(req.params.id);
    if (!parking) return res.status(404).json({ message: "Parking tidak ditemukan" });
    res.json(parking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// export const updateParking = async (req, res) => {
//   const nomor = parseInt(req.params.nomor, 10);
//   if (Number.isNaN(nomor)) {
//     return res.status(400).json({ message: "Nomor parkir tidak valid" });
//   }

//   const { userid, status, rolesUser, slot_id } = req.body;
//   console.log("📩 UpdateParking body:", req.body);

//   try {
//     const parking = await ParkingModel.updateParking({
//       nomor,
//       userid,
//       status,
//       rolesUser,
//       slot_id
//     });

//     if (!parking) return res.status(404).json({ message: "Parking tidak ditemukan" });
//     return res.json(parking);
//   } catch (err) {
//     console.error("❌ Error updateParking:", err);
//     return res.status(500).json({ message: "Terjadi kesalahan server" });
//   }
// };


// export const updateParking = async (req, res) => {
//   const nomor = parseInt(req.params.nomor, 10);
//   if (Number.isNaN(nomor)) {
//     return res.status(400).json({ message: "Nomor parkir tidak valid" });
//   }

//   const { userid, status } = req.body;

//   try {
//     const parking = await ParkingModel.updateParking({
//       nomor,
//       userid,
//       status
//     });

//     if (!parking) return res.status(404).json({ message: "Data parkir tidak ditemukan" });
//     res.json(parking);
//   } catch (err) {
//     console.error("❌ Error updateParking:", err.message);
//     if (err.message.includes("sudah menempati slot")) {
//       return res.status(400).json({ message: err.message });
//     }
//     res.status(500).json({ message: "Gagal memperbarui data parkir" });
//   }
// };

export const updateParking = async (req, res) => {
  try {
    // Ambil parameter "nomor" dari URL
    const nomor = parseInt(req.params.nomor, 10);
    if (isNaN(nomor)) {
      return res.status(400).json({ message: "Nomor parkir tidak valid" });
    }

    // Ambil body dari request
    const { userid, status } = req.body;
    if (!userid || !status) {
      return res.status(400).json({ message: "userid dan status wajib diisi" });
    }

    console.log(`📥 PATCH /parking/${nomor} | userid=${userid}, status=${status}`);

    // Jalankan updateParking di model
    const updated = await ParkingModel.updateParking({ nomor, userid, status });

    // Jika tidak ditemukan
    if (!updated) {
      return res.status(404).json({ message: "Data parkir tidak ditemukan" });
    }

    // ✅ Berhasil
    res.status(200).json({
      message: "Data parkir berhasil diperbarui",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error updateParking:", err.message);

    // Tangani error khusus
    if (err.message.includes("User tidak ditemukan")) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    if (err.message.includes("Slot tidak ditemukan")) {
      return res.status(404).json({ message: "Slot parkir tidak ditemukan" });
    }

    res.status(500).json({
      message: "Gagal memperbarui data parkir",
      error: err.message,
    });
  }
};