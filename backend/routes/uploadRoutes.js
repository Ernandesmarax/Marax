import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Pasta temporária para armazenar a imagem antes do upload

router.post("/upload", upload.single("image"), uploadImage);

export default router;
