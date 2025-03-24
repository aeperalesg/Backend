import { connectDB } from '../config/db';
import sql from 'mssql';

// Interfaz para tipar la respuesta de la base de datos
interface ProductData {
    codart: number; // Agregado para incluir codart en la respuesta
    codalm: string;
    cantfisico: number;
    precio: number;
    descripcion: string;
}

export async function obtenerDatosProducto(id: number): Promise<ProductData[]> {
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT
                    S.codart,  -- Agregado para incluirlo en la respuesta
                    S.codalm,
                    S.cantfisico,
                    P.precio,
                    A.descripcion
                FROM ALSTOCK S
                LEFT JOIN ALPRECIO P ON S.codart = P.codart
                LEFT JOIN ALART A ON S.codart = A.codart
                WHERE S.codart = @id
            `);

        return result.recordset as ProductData[];
    } catch (error) {
        console.error('Error al obtener datos del producto:', error);
        throw error;
    }
}
