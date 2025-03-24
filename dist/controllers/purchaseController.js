"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrder = async (req, res) => {
    try {
        const { userDni, totalAmount, cartItems } = req.body;
        if (!userDni || !totalAmount || !cartItems || cartItems.length === 0) {
            res.status(400).json({ error: "Datos incompletos para la orden" });
            return;
        }
        // Crear la orden en la base de datos
        const order = await prisma.order.create({
            data: {
                userDni,
                totalAmount: parseFloat(totalAmount),
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.nombre,
                        quantity: item.quantity,
                        price: item.precioNormal,
                    })),
                },
            },
            include: { items: true },
        });
        res.status(201).json(order);
    }
    catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ error: "Error al procesar la orden" });
    }
};
exports.createOrder = createOrder;
