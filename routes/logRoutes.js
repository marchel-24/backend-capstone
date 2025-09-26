import express from "express";
import * as logController from "../controllers/logController.js";

const router = express.Router();

router.get("/", logController.getLogs);
router.get("/:id", logController.getLog);
router.post("/", logController.addLog);
router.delete("/:id", logController.removeLog);

export default router;
