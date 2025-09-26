import * as PelanggaranModel from "../models/pelanggaranModel.js";

export const getPelanggarans = async (req, res) => {
  res.json(await PelanggaranModel.getAllPelanggaran());
};

export const getPelanggaran = async (req, res) => {
  const p = await PelanggaranModel.getPelanggaranById(req.params.id);
  if (!p) return res.status(404).json({ message: "Pelanggaran tidak ditemukan" });
  res.json(p);
};

export const addPelanggaran = async (req, res) => {
  res.status(201).json(await PelanggaranModel.createPelanggaran(req.body));
};

export const removePelanggaran = async (req, res) => {
  const p = await PelanggaranModel.deletePelanggaran(req.params.id);
  if (!p) return res.status(404).json({ message: "Pelanggaran tidak ditemukan" });
  res.json(p);
};
