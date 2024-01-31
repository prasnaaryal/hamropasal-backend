// Schema is a class that allows us to represent a collection of fields
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
    validate: [isEmail, "please enter valid email"],
  },

  password: {
    type: String,
    required: true,
    minlength: [6, "Minimun password length is 6"],
    select: false,
    match: [
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$/,
      "Password must have uppercase, lowercase and special character.",
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
});

userSchema.index({ email: 1 }, { unique: true });

export default model("User", userSchema);
