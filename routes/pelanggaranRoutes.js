import express from "express";
import * as pelanggaranController from "../controllers/pelanggaranController.js";

const router = express.Router();

router.get("/", pelanggaranController.getPelanggarans);
router.get("/:id", pelanggaranController.getPelanggaran);
router.post("/", pelanggaranController.addPelanggaran);
router.delete("/:id", pelanggaranController.removePelanggaran);

export default router;
