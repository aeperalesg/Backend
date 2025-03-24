"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrders = exports.updateOrderStatus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            res.status(400).json({ success: false, error: "Datos incompletos" });
            return;
        }
        const updatedOrder = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { status },
        });
        res.status(200).json({ success: true, data: updatedOrder });
    }
    catch (error) {
        console.error("Error al actualizar el estado de la orden:", error);
        res.status(500).json({ success: false, error: "Error al actualizar la orden" });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const listOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        console.error("Error al obtener las órdenes:", error);
        res.status(500).json({ success: false, error: "Error al obtener las órdenes" });
    }
};
exports.listOrders = listOrders;
