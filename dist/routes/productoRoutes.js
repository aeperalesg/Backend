"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productoController_1 = require("../controllers/productoController");
const router = express_1.default.Router();
// Ruta para obtener la visibilidad de los productos
router.get("/products/visibility", productoController_1.getProductsVisibility);
// Ruta para actualizar la visibilidad de un producto específico
router.put("/products/visibility/:id", productoController_1.updateProductVisibility);
exports.default = router;
