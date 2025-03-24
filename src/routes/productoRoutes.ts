import express from "express";
import { getProductsVisibility, updateProductVisibility } from "../controllers/productoController";

const router = express.Router();

// Ruta para obtener la visibilidad de los productos
router.get("/products/visibility", getProductsVisibility);

// Ruta para actualizar la visibilidad de un producto específico
router.put("/products/visibility/:id", updateProductVisibility);

export default router;
