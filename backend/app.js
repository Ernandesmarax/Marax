import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import carsRouter from "./routes/carsRoutes.js";

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/users", userRouter); // Rota de usuários
app.use("/cars", carsRouter); // Rota de carros

app.listen(4000, () => console.log("API do Gui está online"));
