import * as UserModel from "../models/userModel.js";

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
  const { nama, roles, license } = req.body;
  try {
    const newUser = await UserModel.createUser({ nama, roles, license });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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
