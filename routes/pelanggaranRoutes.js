import express from "express";
import * as pelanggaranController from "../controllers/pelanggaranController.js";

const router = express.Router();

router.get("/", pelanggaranController.getPelanggarans);
router.get("/:id", pelanggaranController.getPelanggaran);
router.post("/", pelanggaranController.addPelanggaran);
router.delete("/:id", pelanggaranController.removePelanggaran);

router.post("/detect", async (req, res) => {
    await detectAndInsertPelanggaran();
    res.json({ message: "Deteksi pelanggaran selesai dijalankan." });
});

export default router;
