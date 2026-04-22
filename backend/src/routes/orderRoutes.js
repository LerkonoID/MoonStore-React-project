const express = require("express");
const router = express.Router();
const { 
  createOrder, 
  getAllOrders, 
  getOrdersByUser, 
  getOrderById,
  updateOrderStatus
} = require("../controllers/orderController");

router.get("/", getAllOrders);                    // GET все заказы
router.post("/", createOrder);                    // POST создать заказ (с транзакциями!)
router.get("/user/:userId", getOrdersByUser);     // GET заказы пользователя
router.get("/:id", getOrderById);                 // GET заказ по ID
router.put("/:id/status", updateOrderStatus);     // PUT изменить статус

module.exports = router;