"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { nombre, apellido, ciudad, dni, telefono, ruc, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, message: "El correo ya está registrado." });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { nombre, apellido, ciudad, dni, telefono, ruc, email, password: hashedPassword, token: null }
        });
        res.status(201).json({ success: true, message: "Usuario registrado con éxito." });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error en el registro", error: error.message });
    }
});
// Inicio de sesión
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ success: false, message: "Usuario no encontrado." });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Contraseña incorrecta." });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // ✅ Guarda el token en la base de datos (sobrescribe el anterior)
        await prisma.user.update({
            where: { id: user.id },
            data: { token }
        });
        res.json({ success: true, token, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error en el inicio de sesión", error: error.message });
    }
});
// Middleware para verificar el token
const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ success: false, message: "Acceso denegado" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user || user.token !== token) {
            res.status(401).json({ success: false, message: "Sesión inválida, inicie sesión nuevamente" });
            return;
        }
        req.user = user; // ✅ Ahora TypeScript reconoce `req.user`
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Token inválido" });
    }
};
// Cerrar sesión
router.post("/logout", authenticate, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Usuario no autenticado" });
            return;
        }
        await prisma.user.update({
            where: { id: req.user.id },
            data: { token: null }
        });
        res.json({ success: true, message: "Sesión cerrada con éxito" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error al cerrar sesión", error: error.message });
    }
});
exports.default = router;
