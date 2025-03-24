import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    options: { encrypt: false, trustServerCertificate: true }
};

export async function connectDB(): Promise<sql.ConnectionPool> {
    try {
        const pool = await sql.connect(config);
        console.log('Conectado a SQL Server');
        return pool;
    } catch (error) {
        console.error('Error al conectar con SQL Server:', error);
        throw error;
    }
}
