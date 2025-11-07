import express from "express";
import * as logController from "../controllers/logController.js";

const router = express.Router();

router.get("/", logController.getLogs);
router.get("/:id", logController.getLog);
router.delete("/:id", logController.removeLog);
router.post("/gate/in", logController.logGateIn);
router.post("/gate/out", logController.logGateOut);
router.post("/event", logController.logEvent);

export default router;
