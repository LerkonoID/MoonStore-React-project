const db = require("../db/connection");

const createOrder = async (req, res) => {
  try {
    const { customer_name, phone, address, items, total } = req.body;

    if (!customer_name || !phone || !address || !items || total === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [result] = await db.query(
      "INSERT INTO orders (customer_name, phone, address, items, total) VALUES (?, ?, ?, ?, ?)",
      [customer_name, phone, address, JSON.stringify(items), total]
    );

    res.status(201).json({
      message: "Order created successfully",
      orderId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
};