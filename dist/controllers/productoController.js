"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductVisibility = exports.getProductsVisibility = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtener todos los productos con su visibilidad
const getProductsVisibility = async (req, res) => {
    try {
        const productos = await prisma.product.findMany();
        res.json(productos);
    }
    catch (error) {
        console.error("Error al obtener la visibilidad:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};
exports.getProductsVisibility = getProductsVisibility;
// Actualizar visibilidad de un producto
const updateProductVisibility = async (req, res) => {
    try {
        const { id } = req.params; // Cambiado de codart a id
        const { visible } = req.body;
        if (!id) {
            res.status(400).json({ error: "El parámetro id es obligatorio" });
            return;
        }
        if (typeof visible !== "boolean") {
            res.status(400).json({ error: "El campo visible debe ser booleano" });
            return;
        }
        const idValue = Number(id);
        if (isNaN(idValue)) {
            res.status(400).json({ error: "El parámetro id debe ser un número válido" });
            return;
        }
        const productoActualizado = await prisma.product.update({
            where: { id: idValue },
            data: { visible },
        });
        res.json(productoActualizado);
    }
    catch (error) {
        console.error("Error al actualizar visibilidad:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
};
exports.updateProductVisibility = updateProductVisibility;
