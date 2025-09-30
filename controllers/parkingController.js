import * as ParkingModel from "../models/parkingModel.js";

export const getParkings = async (req, res) => {
  res.json(await ParkingModel.getAllParking());
};

export const getParking = async (req, res) => {
  const parking = await ParkingModel.getParkingById(req.params.id);
  if (!parking) return res.status(404).json({ message: "Parking tidak ditemukan" });
  res.json(parking);
};

export const addParking = async (req, res) => {
  res.status(201).json(await ParkingModel.createParking(req.body));
};

export const removeParking = async (req, res) => {
  const parking = await ParkingModel.deleteParking(req.params.id);
  if (!parking) return res.status(404).json({ message: "Parking tidak ditemukan" });
  res.json(parking);
};

export const updateParking = async (req, res) => {
  const nomor = parseInt(req.params.nomor, 10);
  if (Number.isNaN(nomor)) {
    return res.status(400).json({ message: "Nomor parkir tidak valid" });
  }

  const { userid, status } = req.body;

  try {
    const parking = await ParkingModel.updateParking({ nomor, userid, status });
    if (!parking) return res.status(404).json({ message: "Parking tidak ditemukan" });
    return res.json(parking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
