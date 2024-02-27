import * as AuthService from "../../services/auth/authService.mjs";

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    image,
  } = req.body;
  try {
    const user = await AuthService.registerUser(
      email.trim(),
      password.trim(),
      confirmPassword.trim(),
      firstName.trim(),
      lastName.trim(),
      image
    );
    return res.status(200).json({ message: "User created successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// for login

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const accessToken = await AuthService.loginUser(email.trim(), password.trim());
    return res
      .status(200)
      .json({ message: "User logged in successfully", accessToken });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};