import { Router } from "express";
import UserRepository from "../repository/UserRepository.js";
import bcrypt from "bcrypt";

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

router.post("/login", async (req, res) => {
  const { surname, password } = req.body;

  try {
    const userRepo = new UserRepository();
    const user = await userRepo.getBySurname(surname);

    if (!user) {
      return res.status(400).json({ message: "Usuário inválida(o)." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Usuário ou senha inválida(o)." });
    }

    res.status(200).json({ message: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

export default router;
