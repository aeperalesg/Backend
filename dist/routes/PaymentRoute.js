"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PaymentController_1 = require("../controllers/PaymentController");
const router = express_1.default.Router();
router.post("/create-payment-intent", PaymentController_1.createPaymentIntent);
router.post("/webhook", express_1.default.raw({ type: "application/json" }), PaymentController_1.handleStripeWebhook);
exports.default = router;
