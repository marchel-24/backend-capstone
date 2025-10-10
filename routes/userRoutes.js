import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.addUser);
router.delete("/:id", userController.removeUser);
router.post("/login", userController.login);
router.patch("/updatepassword", userController.updatepassword);

export default router;
