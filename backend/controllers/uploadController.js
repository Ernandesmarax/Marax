import cloudinary from "../config/cloudinary.js";
import fs from "fs";

async function uploadImage(req, res) {
  try {
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "marax_cars",
    });

    fs.unlinkSync(filePath); // Deleta o arquivo temporário

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Exportação correta para ES Modules
export { uploadImage };
