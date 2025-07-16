import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDb from "./config/connectToDB.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

app.get("/", async (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
