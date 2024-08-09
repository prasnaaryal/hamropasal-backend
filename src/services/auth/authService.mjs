import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as EmailService from "../email/emailServices.mjs";
import User from "../../models/User.js";

// Helper function to validate the password
function validatePassword(password) {
  if (password.length > 8) {
    return false; // Password must be 8 characters or less
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
}

// Registration service
export async function registerUser(
  email,
  password,
  confirmPassword,
  firstName,
  lastName,
  image
) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with the same Email or Username already exists");
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Validate the password
    if (!validatePassword(password)) {
      throw new Error(
        "Password must be a maximum of 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      image,
      passwordChangedAt: Date.now(), // Initialize passwordChangedAt
    });

    // Save the user to the database
    await newUser.save();

    // Send verification email (optional)
    // const token = EmailService.generateToken(email);
    // await EmailService.sendVerificationEmail(email, token);

    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Login service
export async function loginUser(email, password) {
  try {
    // Find the user by email
    const user = await User.findOne({ email }).select(
      "+password +passwordChangedAt"
    );

    // Check if the user exists
    if (!user) {
      throw new Error("User does not exist");
    }

    // Check if the password is expired (90 days)
    const passwordExpiryDate = new Date(user.passwordChangedAt);
    passwordExpiryDate.setDate(passwordExpiryDate.getDate() + 90);

    if (Date.now() > passwordExpiryDate) {
      throw new Error("Password has expired. Please reset your password.");
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Password does not match");
    }

    // JSON Web Token creation
    const LoggedInUser = { username: user.username, userId: user._id };
    const accessToken = jwt.sign(LoggedInUser, process.env.ACCESS_TOKEN_SECRET);

    // Login successful
    return accessToken;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Email verification service
export const verifyEmail = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { email } = decodedToken;

    const user = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true } // Add the new option to get the updated user
    );

    if (!user) {
      throw new Error("User does not exist");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Request password reset service
export const resetPasswordRequest = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }

    // Generate a token
    const resetToken = EmailService.generateToken(email);
    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 720);
    user.resetToken = {
      token: resetToken,
      expiration: resetTokenExpiration,
    };

    await user.save();

    // Send the email
    await EmailService.sendResetPasswordEmail(user.email, resetToken);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Verify reset password token service
export const verifyResetPassword = async (resetToken) => {
  try {
    const user = await User.findOne({
      "resetToken.token": resetToken,
      "resetToken.expiration": { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    return user;
  } catch (error) {
    // Handle the error and provide a more informative error message
    throw new Error(`Reset password verification failed: ${error.message}`);
  }
};

// Reset password service
export const resetPassword = async (resetToken, password, confirmPassword) => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Password and confirm password do not match");
    }

    // Validate the new password
    if (!validatePassword(password)) {
      throw new Error(
        "Password must be a maximum of 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }

    const user = await User.findOne({
      "resetToken.token": resetToken,
      "resetToken.expiration": { $gt: Date.now() },
    }).select("password oldPasswords passwordChangedAt");

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the new password is the same as the old password or any of the old passwords
    const isSamePassword = await bcrypt.compare(password, user.password);
    const isOldPassword = user.oldPasswords
      ? await Promise.all(
          user.oldPasswords.map(async (oldPassword) =>
            bcrypt.compare(password, oldPassword)
          )
        )
      : [];

    if (isSamePassword || isOldPassword.includes(true)) {
      throw new Error(
        "New password cannot be the same as any previous passwords"
      );
    }

    // Update the user's password and add the current password to oldPasswords
    user.oldPasswords = user.oldPasswords || [];
    user.oldPasswords.push(user.password);
    user.password = hashedPassword;
    user.passwordChangedAt = Date.now(); // Update password change timestamp
    user.resetToken = undefined;

    // Limit the number of old passwords stored (optional, e.g., store only the last 5)
    if (user.oldPasswords.length > 5) {
      user.oldPasswords.shift();
    }

    await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};
