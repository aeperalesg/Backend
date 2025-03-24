import { Router } from "express";
import { uploadImage, getImages, updateImageVisibility } from "../controllers/imageController";

const router = Router();

router.post("/upload", uploadImage);
router.get("/", getImages); // Nueva ruta para obtener imágenes
router.put("/visibility/:id", updateImageVisibility);

export default router;
