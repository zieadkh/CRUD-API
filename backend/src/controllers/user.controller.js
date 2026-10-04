import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

const registerUser = async (req, res) => {
  try {
    const {username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({message : "All fiels are important!"});
    }
    const existing = await User.findOne({email: email.toLowerCase()});
    if (existing) {
      return res.status(400).json({message: "user already exist!"});
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      loggedIn: false
    });

    res.status(201).json({
      message: "User registered",
      user: {id: user._id, email: user.email, username: user.username}
    });
  } catch (error) {
    res.status(500).json({message: "internal server Error", error: error.message});
  }
};

const loginUser = async (req, res) => {
  try {


    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const user = await User.findOne({
      email: email.toLowerCase()
    });


    if (!user) return res.status(400).json({
      message: "User not found"
    });

    const isMatch =  await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({
      message: "invalid credentials"
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      message: "User loggedin",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      },
      accessToken,
      refreshToken
    })

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


const logoutuser = async (req ,res) => {
  try {
    // Stateless JWT logout: nothing is stored server-side, so the client
    // just discards both tokens. Sending a refresh token here is optional.
    res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error", error
    });
  }
}

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "refreshToken is required" });
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  registerUser,
  loginUser,
  logoutuser,
  refreshAccessToken,
};

