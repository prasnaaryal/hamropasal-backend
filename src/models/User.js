import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail.js";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: true,
    minlength: [6, "Minimum password length is 6"],
    select: false,
    match: [
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,8}$/,
      "Password must have uppercase, lowercase, special character, and be between 6-8 characters.",
    ],
  },

  image: {
    type: String,
    default: null,
  },

  resetToken: {
    token: {
      type: String,
      select: false,
      default: null,
    },
    expiration: {
      type: Date,
      default: null,
      select: false,
    },
  },

  oldPasswords: [
    {
      type: String,
      select: false,
    },
  ],
});

userSchema.index({ email: 1 }, { unique: true });

export default model("User", userSchema);
