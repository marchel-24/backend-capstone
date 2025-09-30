import express from "express";
import * as parkingController from "../controllers/parkingController.js";

const router = express.Router();

router.get("/", parkingController.getParkings);
router.get("/:id", parkingController.getParking);
router.post("/", parkingController.addParking);
router.delete("/:id", parkingController.removeParking);
router.patch("/:nomor", parkingController.updateParking);

export default router;
