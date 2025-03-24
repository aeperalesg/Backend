"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductData = getProductData;
const productService_1 = require("../services/productService");
async function getProductData(req, res) {
    const codart = Number(req.params.codart);
    if (isNaN(codart)) {
        res.status(400).json({ error: 'Código de artículo inválido' });
        return;
    }
    try {
        const producto = await (0, productService_1.obtenerDatosProducto)(codart);
        if (producto.length === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json(producto);
    }
    catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
