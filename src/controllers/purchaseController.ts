import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response): Promise<void> => {
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
          create: cartItems.map((item: any) => ({
            productId: item.nombre,
            quantity: item.quantity,
            price: item.precioNormal,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: "Error al procesar la orden" });
  }
};
