import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import carsRouter from "./routes/carsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Servir arquivos estáticos da pasta public
app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/cars", carsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API do Gui está online na porta ${port}`));
