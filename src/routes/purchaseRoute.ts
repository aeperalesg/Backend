import express from "express";
import { createOrder } from "../controllers/purchaseController";

const router = express.Router();

router.post("/create", createOrder);

export default router;
