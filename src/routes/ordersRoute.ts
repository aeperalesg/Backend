import express from "express";
import { updateOrderStatus } from "../controllers/ordersController";
import { listOrders } from "../controllers/ordersController";

const router = express.Router();

router.post("/status", updateOrderStatus);
router.get("/list", listOrders);
export default router;
