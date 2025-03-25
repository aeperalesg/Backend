import app from "../src/app"; // Importa tu configuración de Express
import { VercelRequest, VercelResponse } from "@vercel/node";

export default (req: VercelRequest, res: VercelResponse) => {
    app(req, res);
};
