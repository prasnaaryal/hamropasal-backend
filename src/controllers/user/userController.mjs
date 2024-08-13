import * as UserServices from "../../services/user/userServices.mjs";
import * as pkg from "express-validator";

const { sanitizeBody, validationResult } = pkg;

export const getUserDetails = [
  // Sanitize the userId in the body (assuming it's in req.body.User.userId)
  sanitizeBody("User.userId").trim().escape(),

  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.User;

    try {
      const user = await UserServices.getUserDetails(userId);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
];
