import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
  res.status(200).json({ message: "Admin page is working" });
});

export default router;
