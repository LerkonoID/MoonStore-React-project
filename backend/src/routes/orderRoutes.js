const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders } = require("../controllers/orderController");

router.get("/", getAllOrders);
router.post("/", createOrder);

module.exports = router;