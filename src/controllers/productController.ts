import { Request, Response } from 'express';
import { obtenerDatosProducto } from '../services/productService';

export async function getProductData(req: Request, res: Response): Promise<void> {
    const codart = Number(req.params.codart);

    if (isNaN(codart)) {
        res.status(400).json({ error: 'Código de artículo inválido' });
        return;
    }

    try {
        const producto = await obtenerDatosProducto(codart);
        if (producto.length === 0) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
