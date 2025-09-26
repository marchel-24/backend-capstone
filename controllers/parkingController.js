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
