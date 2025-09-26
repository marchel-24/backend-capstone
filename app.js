import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import pelanggaranRoutes from "./routes/pelanggaranRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// middleware logging
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - Body:`, req.body);
  next();
});

// routes
app.use("/users", userRoutes);
app.use("/parking", parkingRoutes);
app.use("/logs", logRoutes);
app.use("/pelanggaran", pelanggaranRoutes);

export default app;
