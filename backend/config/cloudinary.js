import cloudinary from "cloudinary"; // Importação correta
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis de ambiente

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Exportação correta para ES Modules
export default cloudinary;
