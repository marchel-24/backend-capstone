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
//   try {
//     // Ambil parameter "nomor" dari URL
//     const nomor = parseInt(req.params.nomor, 10);
//     if (isNaN(nomor)) {
//       return res.status(400).json({ message: "Nomor parkir tidak valid" });
//     }

//     // Ambil body dari request
//     const { userid, status } = req.body;
//     if (!userid || !status) {
//       return res.status(400).json({ message: "userid dan status wajib diisi" });
//     }

//     console.log(`📥 PATCH /parking/${nomor} | userid=${userid}, status=${status}`);

//     // Jalankan updateParking di model
//     const updated = await ParkingModel.updateParking({ nomor, userid, status });

//     // Jika tidak ditemukan
//     if (!updated) {
//       return res.status(404).json({ message: "Data parkir tidak ditemukan" });
//     }

//     // ✅ Berhasil
//     res.status(200).json({
//       message: "Data parkir berhasil diperbarui",
//       data: updated,
//     });
//   } catch (err) {
//     console.error("❌ Error updateParking:", err.message);

//     // Tangani error khusus
//     if (err.message.includes("User tidak ditemukan")) {
//       return res.status(404).json({ message: "User tidak ditemukan" });
//     }
//     if (err.message.includes("Slot tidak ditemukan")) {
//       return res.status(404).json({ message: "Slot parkir tidak ditemukan" });
//     }

//     res.status(500).json({
//       message: "Gagal memperbarui data parkir",
//       error: err.message,
//     });
//   }
// };

export const updateParking = async (req, res) => {
  try {
    const nomor = parseInt(req.params.nomor, 10);
    if (isNaN(nomor)) {
      return res.status(400).json({ message: "Nomor parkir tidak valid" });
    }

    // userid boleh null (kalau user meninggalkan slot tapi BLE masih membaca)
    const { userid } = req.body;

    console.log(`📥 PATCH /parking/${nomor} | userid=${userid}`);

    // Panggil model untuk menjalankan logika lengkap (sensor + pelanggaran)
    const updated = await ParkingModel.updateParking({ nomor, userid });

    if (!updated) {
      return res.status(404).json({ message: "Data parkir tidak ditemukan" });
    }

    res.status(200).json({
      message: "Data parkir berhasil diperbarui",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error updateParking:", err.message);

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


export const getParkingStats = async (req, res) => {
  try {
    const stats = await ParkingModel.getParkingStats();
    res.json(stats);
  } catch (err) {
    console.error("Error getParkingStats:", err);
    res.status(500).json({ message: "Gagal mengambil statistik parkir" });
  }
};
