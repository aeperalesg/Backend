import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    res.status(500).json({ success: false, error: "Error al actualizar la orden" });
  }
};

export const listOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({ success: false, error: "Error al obtener las órdenes" });
  }
};
