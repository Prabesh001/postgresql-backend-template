import express from "express";
import { getUser } from "../services/userServices.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUser({ id });

    res.send(user.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
});

export default router;
