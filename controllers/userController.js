import * as UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

    const existing = await UserModel.getUserByMail(email);
    if (existing) {
      return res.status(409).json({ message: "Email sudah digunakan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.createUser({
      nama,
      license,
      email,
      roles,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User berhasil dibuat",
      user
    });

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
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const payload = {
      userID: user.userid,
      nama: user.nama,
      roles: user.roles,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

    res.status(200).json({
      message: "Login successful!",
      token,
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const update = await UserModel.updatepassword(email, hashedPassword);

    res.status(200).json(update);
  } catch (err) {
    res.status(500).json(err);
  }
};
