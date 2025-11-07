import * as PelanggaranModel from "../models/pelanggaranModel.js";

export const getPelanggarans = async (req, res) => {
  res.json(await PelanggaranModel.getAllPelanggaran());
};

export const getPelanggaran = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PelanggaranModel.getPelanggaranById(id);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Tidak ada pelanggaran untuk user ini" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error getByUser:", err);
    res.status(500).json({ message: "Gagal mengambil data pelanggaran" });
  }
};

export const addPelanggaran = async (req, res) => {
  res.status(201).json(await PelanggaranModel.createPelanggaran(req.body));
};

export const removePelanggaran = async (req, res) => {
  const p = await PelanggaranModel.deletePelanggaran(req.params.id);
  if (!p) return res.status(404).json({ message: "Pelanggaran tidak ditemukan" });
  res.json(p);
};
