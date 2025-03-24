"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ordersController_1 = require("../controllers/ordersController");
const ordersController_2 = require("../controllers/ordersController");
const router = express_1.default.Router();
router.post("/status", ordersController_1.updateOrderStatus);
router.get("/list", ordersController_2.listOrders);
exports.default = router;
