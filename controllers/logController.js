import * as LogModel from "../models/logModel.js";

export const getLogs = async (req, res) => {
  res.json(await LogModel.getAllLogs());
};

export const getLog = async (req, res) => {
  const log = await LogModel.getLogById(req.params.id);
  if (!log) return res.status(404).json({ message: "Log tidak ditemukan" });
  res.json(log);
};


export const removeLog = async (req, res) => {
  const log = await LogModel.deleteLog(req.params.id);
  if (!log) return res.status(404).json({ message: "Log tidak ditemukan" });
  res.json(log);
};
