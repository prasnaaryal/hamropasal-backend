import express from "express";
import { authenticateToken } from "../../middleware/index.js";
import {
  createOrder,
  confirmOrderPayment,
  getAllOrders,
  deleteOrder,
  getAllOrdersByUser,
  getOrderById,
  updateOrderStatus,
} from "../../controllers/order/orderController.mjs";

const router = express.Router();

router.post("/create-order", authenticateToken, createOrder);
router.post("/confirm-order-payment", authenticateToken, confirmOrderPayment);
router.get("/get-all-orders", authenticateToken, getAllOrders);
router.get(
  "/get-all-orders-by-user/:id?",
  authenticateToken,
  getAllOrdersByUser
);
router.get("/get-order-by-id/:orderId", authenticateToken, getOrderById);
router.put(
  "/update-order-status/:orderId",
  authenticateToken,
  updateOrderStatus
);
router.delete("/delete-order/:orderId", authenticateToken, deleteOrder);

export default router;
