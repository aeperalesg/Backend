import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia", // Versión actualizada de la API de Stripe
});

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Datos recibidos en el backend:", req.body);

    const { totalAmount, userDni, cartItems } = req.body;

    if (!totalAmount || !userDni || !cartItems || cartItems.length === 0) {
      res.status(400).json({ error: "Datos incompletos para el pago" });
      return;
    }

    // Crear la orden en la base de datos
    const order = await prisma.order.create({
      data: {
        userDni,
        totalAmount,
        status: "pending", // Puedes actualizar el estado a 'pending' inicialmente
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.nombre, // Asegúrate de que `nombre` sea el ID del producto
            quantity: item.quantity,
            price: item.precioNormal,
          })),
        },
      },
    });

    console.log("Orden creada:", order); // Para verificar si la orden se crea correctamente

    // Crear un PaymentIntent con Stripe y pasar solo el orderId en la metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe espera el monto en centavos
      currency: "pen",
      metadata: {
        userDni,
        orderId: order.id, // Enviar solo el ID de la orden en la metadata
      },
    });

    console.log("PaymentIntent creado:", paymentIntent);

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error al crear el PaymentIntent:", error);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};


export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    } else {
      res.status(400).send(`Webhook Error: Unknown error`);
    }
    return;
  }

  // Manejar el evento de pago exitoso
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { orderId } = paymentIntent.metadata;

    // Recuperar la orden de la base de datos utilizando el orderId
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { items: true }, // Incluye los detalles de los productos
    });

    if (order) {
      // Actualizar la orden en la base de datos con el estado "completed"
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "completed" },
      });

      res.status(200).json({ received: true });
    } else {
      res.status(404).json({ error: "Orden no encontrada" });
    }
  } else {
    res.status(200).json({ received: true });
  }
};

