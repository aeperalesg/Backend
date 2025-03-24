import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  const { imageUrl, type, productId } = req.body;

  if (!imageUrl || !type) {
    res.status(400).json({ error: "Faltan datos obligatorios (imageUrl, type)" });
    return;
  }

  // Verificar que el tipo de imagen es válido
  const validTypes = ["promo", "newproduct", "muestra"];
  if (!validTypes.includes(type)) {
    res.status(400).json({ error: "Tipo de imagen no válido" });
    return;
  }

  try {
    const newImage = await prisma.image.create({
      data: {
        url: imageUrl,
        type,
        productId: type === "muestra" ? productId : null,
      },
    });

    res.status(201).json({ message: "Imagen guardada", newImage });
  } catch (error) {
    console.error("Error al guardar la imagen:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const images = await prisma.image.findMany();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const updateImageVisibility = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;
  const { visible } = req.body;

  if (!["Sí", "No"].includes(visible)) {
    res.status(400).json({ error: "Valor inválido para visible" });
    return;
  }

  try {
    const existingImage = await prisma.image.findFirst({
      where: { productId, type: "muestra" },
    });

    if (!existingImage) {
      res.status(404).json({ error: "Imagen no encontrada" });
      return;
    }

    await prisma.image.updateMany({
      where: { productId, type: "muestra" },
      data: { visible },
    });

    res.status(200).json({ message: "Estado actualizado" });
  } catch (error: unknown) {
    console.error("Error al actualizar visibilidad:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
