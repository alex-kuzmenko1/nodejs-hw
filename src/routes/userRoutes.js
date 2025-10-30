import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";
import { updateUserAvatar } from "../controllers/userController.js";

const router = express.Router();

router.patch("/users/me/avatar", authenticate, upload.single("avatar"), updateUserAvatar);

export default router;
