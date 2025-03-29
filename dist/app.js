"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("./controllers/userController"));
const cors_1 = __importDefault(require("cors"));
const purchaseRoute_1 = __importDefault(require("./routes/purchaseRoute"));
const PaymentRoute_1 = __importDefault(require("./routes/PaymentRoute"));
const ordersRoute_1 = __importDefault(require("./routes/ordersRoute"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes")); // Importar las rutas de imágenes
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const productoRoutes_1 = __importDefault(require("./routes/productoRoutes"));
const app = (0, express_1.default)();
// Configuración de CORS
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://backendtaberna.vercel.app", "https://www.licoreslatabernaperu.com"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
// Middleware para manejar JSON
app.use(express_1.default.json());
// Rutas
app.use("/auth", userController_1.default);
app.use("/api/orders", purchaseRoute_1.default);
app.use("/api/payment", PaymentRoute_1.default);
app.use("/api/order", ordersRoute_1.default);
app.use('/api/pr', productRoutes_1.default);
app.use('/api/vs', productoRoutes_1.default);
app.use("/api/images", imageRoutes_1.default);
exports.default = app; // 👈 Agrega esto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
