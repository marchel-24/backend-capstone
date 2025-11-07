import * as LogModel from "../models/logModel.js";

export const getLogs = async (req, res) => {
  try {
    const result = await LogModel.getAllLogs();
    res.json(result);
  } catch (err) {
    console.error("Error getLogs:", err);
    res.status(500).json({ message: "Gagal mengambil data log" });
  }
};

export const getLog = async (req, res) => {
  try {
    const logs = await LogModel.getLogById(req.params.id);
    if (!logs || logs.length === 0)
      return res.status(404).json({ message: "Log tidak ditemukan" });
    res.json(logs);
  } catch (err) {
    console.error("Error getLog:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const removeLog = async (req, res) => {
  try {
    const log = await LogModel.deleteLog(req.params.id);
    if (!log) return res.status(404).json({ message: "Log tidak ditemukan" });
    res.json(log);
  } catch (err) {
    console.error("Error removeLog:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const logGateIn = async (req, res) => {
  try {
    const { userid } = req.body;
    if (!userid) return res.status(400).json({ message: "userid wajib diisi" });

    const log = await LogModel.createLog({
      id: userid,
      nomor: null,
      status: "entered",
      area: "gate_in",
    });

    res.status(201).json(log);
  } catch (err) {
    console.error("Error logGateIn:", err);
    res.status(500).json({ message: "Gagal mencatat log gate in" });
  }
};

export const logGateOut = async (req, res) => {
  try {
    const { userid } = req.body;
    if (!userid) return res.status(400).json({ message: "userid wajib diisi" });

    const log = await LogModel.createLog({
      id: userid,
      nomor: null,
      status: "exited",
      area: "gate_out",
    });

    res.status(201).json(log);
  } catch (err) {
    console.error("Error logGateOut:", err);
    res.status(500).json({ message: "Gagal mencatat log gate out" });
  }
};

export const logEvent = async (req, res) => {
  try {
    const { userid, area, status } = req.body;
    if (!userid || !area || !status)
      return res.status(400).json({ message: "userid, area, dan status wajib diisi" });

    const newLog = await LogModel.createLog({
      id: userid,
      area,
      status
    });

    return res.status(201).json(newLog);
  } catch (err) {
    console.error("Error logEvent:", err);
    res.status(500).json({ message: "Gagal mencatat log event" });
  }
};