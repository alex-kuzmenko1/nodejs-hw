import createHttpError from "http-errors";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { User } from "../models/user.js";

export const updateUserAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      throw createHttpError(400, "No file uploaded");
    }

    const uploadResult = await saveFileToCloudinary(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({ url: updatedUser.avatar });
  } catch (error) {
    next(error);
  }
};
