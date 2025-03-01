import { Router } from "express";
import UserRepository from "../repository/UserRepository.js";

const router = Router();

router.get("/users", async (req, res) => {
  const result = await new UserRepository().getAll("users");
  res.status(200).send(result);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await new UserRepository().getById("users", id);
  res.status(200).send(result);
});

export default router;
