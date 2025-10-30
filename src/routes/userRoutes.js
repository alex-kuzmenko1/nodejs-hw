
import express from "express";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const router = express.Router();


const upload = multer({
  dest: "tmp/",
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(createHttpError(400, "Only jpeg/png allowed"));
    }
    cb(null, true);
  },
});

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, "Email already in use");
    }
    const user = await User.create({ email, password });
    res.status(201).json({ email: user.email, id: user._id });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      throw createHttpError(401, "Invalid email or password");
    }

    const session = await Session.create({
      userId: user._id,
      accessToken: crypto.randomUUID(),
      accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60),
    });

    res.cookie("accessToken", session.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  res.json({ email: req.user.email, id: req.user._id });
});

router.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw createHttpError(400, "Avatar file is required");
      }

      const tempPath = req.file.path;
      const ext = path.extname(req.file.originalname);
      const newFileName = `${req.user._id}${ext}`;
      const uploadDir = path.join("public", "avatars");

      await fs.mkdir(uploadDir, { recursive: true });
      const targetPath = path.join(uploadDir, newFileName);

      await fs.rename(tempPath, targetPath);

      req.user.avatarURL = `/avatars/${newFileName}`;
      await req.user.save();

      res.json({ avatarURL: req.user.avatarURL });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
