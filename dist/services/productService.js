"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerDatosProducto = obtenerDatosProducto;
const db_1 = require("../config/db");
const mssql_1 = __importDefault(require("mssql"));
async function obtenerDatosProducto(id) {
    try {
        const pool = await (0, db_1.connectDB)();
        const result = await pool.request()
            .input('id', mssql_1.default.Int, id)
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
        return result.recordset;
    }
    catch (error) {
        console.error('Error al obtener datos del producto:', error);
        throw error;
    }
}
