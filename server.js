import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Middleware untuk logging setiap request
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - Body:`, req.body);
  next();
});

// GET /users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "User"');
    console.log("[GET] /users ->", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET /users/:id
app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM "User" WHERE userid = $1', [userId]);
    if (result.rows.length === 0) {
      console.log(`[GET] /users/${userId} -> User tidak ditemukan`);
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    console.log(`[GET] /users/${userId} ->`, result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST /users
app.post("/users", async (req, res) => {
  const { nama, roles, license } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "User" (nama, roles, license) VALUES ($1, $2, $3) RETURNING *',
      [nama, roles, license]
    );
    console.log("[POST] /users ->", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "User" WHERE userid = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      console.log(`[DELETE] /users/${id} -> User tidak ditemukan`);
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    console.log(`[DELETE] /users/${id} ->`, result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  