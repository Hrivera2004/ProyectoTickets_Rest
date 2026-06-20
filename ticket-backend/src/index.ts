import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import issuesRouter from "./routes/issues";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Backend de tickets corriendo" });
});

app.use("/api/issues", issuesRouter);

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
