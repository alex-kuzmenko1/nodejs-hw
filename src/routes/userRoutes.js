import express from "express";
import { updateUserAvatar } from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.patch("/users/me/avatar", auth, upload.single("avatar"), updateUserAvatar);

export default router;
