import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);


userSchema.pre("save", function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});


userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};


userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = model("User", userSchema);
