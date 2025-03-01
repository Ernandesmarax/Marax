import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import carsRouter from "./routes/carsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter); // Rota de usuários
app.use("/cars", carsRouter); // Rota de carros
app.use("/api", uploadRoutes); // Rota de imagens

app.listen(4000, () => console.log("API do Gui está online"));
