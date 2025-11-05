import * as UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const getUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const addUser = async (req, res) => {
  try {
    const { nama, license, email, roles, password } = req.body;
    const user = await UserModel.createUser({ nama, license, email, roles, password });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const removeUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const deletedUser = await UserModel.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json(deletedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await UserModel.getUserByMail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid user." });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // ✅ 1. Buat token JWT
    const payload = {
      userID: user.userid,
      nama: user.nama,
      roles: user.roles,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d" // bisa 1h, 7d, dsb
    });

    // ✅ 2. Kirim token + data user ke client
    res.status(200).json({
      message: "Login successful!",
      token,   // <<=== TOKEN dikirim di sini
      user: {
        userid: user.userid,
        nama: user.nama,
        roles: user.roles,
        license: user.license,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during login process");
  }
};

export const updatepassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const update = await UserModel.updatepassword(email, password);

    res.status(200).json(update);
  } catch (err) {
    res.status(500).json(err);
  }
}