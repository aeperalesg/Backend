import express from "express";
import userController from "./controllers/userController";
import cors from "cors";
import purchaseRoutes from "./routes/purchaseRoute";
import PaymentRoutes from "./routes/PaymentRoute";
import ordersRoutes from "./routes/ordersRoute";
import imageRoutes from "./routes/imageRoutes"; // Importar las rutas de imágenes
import productRoutes from './routes/productRoutes';
import productoRoutes from "./routes/productoRoutes";

const app = express();

// Configuración de CORS
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

// Middleware para manejar JSON
app.use(express.json());

// Rutas
app.use("/auth", userController);
app.use("/api/orders", purchaseRoutes);
app.use("/api/payment", PaymentRoutes);
app.use("/api/order", ordersRoutes);
app.use('/api/pr', productRoutes);
app.use('/api/vs', productoRoutes);
app.use("/api/images", imageRoutes); // Agregar la nueva ruta para imágenes

// Puerto en el que se ejecuta la aplicación
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
