const db = require("../db/connection");

const createOrder = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();

    const {
      buyer_id,
      delivery_address,
      delivery_city,
      delivery_postal_code,
      delivery_method,
      payment_method,
      items,
    } = req.body;

    // Валидация
    if (
      !buyer_id ||
      !delivery_address ||
      !delivery_city ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const buyerIdNum = Number(buyer_id);
    if (!Number.isInteger(buyerIdNum) || buyerIdNum <= 0) {
      return res.status(400).json({ message: "Invalid buyer_id" });
    }

    // НАЧАЛО ТРАНЗАКЦИИ
    await connection.beginTransaction();

    // Шаг 1: Создать заказ
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (buyer_id, delivery_address, delivery_city, delivery_postal_code, order_status, total_amount, delivery_method)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        buyerIdNum,
        delivery_address,
        delivery_city,
        delivery_postal_code || null,
        "pending",
        0,
        delivery_method || "Нова Пошта",
      ]
    );

    const orderId = orderResult.insertId;
    let totalAmount = 0;

    // Шаг 2: Добавить товары
    for (const item of items) {
      const product_id_num = Number(item.product_id);
      const quantity_num = Number(item.quantity);

      if (
        !Number.isInteger(product_id_num) ||
        !Number.isInteger(quantity_num) ||
        quantity_num <= 0
      ) {
        throw new Error(
          `Invalid item payload: product_id=${item.product_id}, quantity=${item.quantity}`
        );
      }

      // Получить информацию о товаре
      const [products] = await connection.execute(
        `SELECT price, seller_id, stock_quantity FROM products WHERE product_id = ?`,
        [product_id_num]
      );

      if (!products.length) {
        throw new Error(`Product ${product_id_num} not found`);
      }

      const { price, seller_id, stock_quantity } = products[0];

      // Проверить наличие на складе
      if (Number(stock_quantity) < quantity_num) {
        throw new Error(
          `Insufficient stock for product ${product_id_num}. Available: ${stock_quantity}, requested: ${quantity_num}`
        );
      }

      // Вычислить subtotal
      const unitPrice = Number(price);
      const subtotal = Number((unitPrice * quantity_num).toFixed(2));

      // Вставить в order_items
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, seller_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, product_id_num, seller_id, quantity_num, unitPrice, subtotal]
      );

      // Уменьшить stock_quantity
      await connection.execute(
        `UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?`,
        [quantity_num, product_id_num]
      );

      totalAmount = Number((totalAmount + subtotal).toFixed(2));
    }

    // Шаг 3: Обновить total_amount в orders
    await connection.execute(`UPDATE orders SET total_amount = ? WHERE order_id = ?`, [
      totalAmount,
      orderId,
    ]);

    // Шаг 4: Создать запись в transactions
    await connection.execute(
      `INSERT INTO transactions (order_id, payment_method, transaction_status, amount) VALUES (?, ?, ?, ?)`,
      [orderId, payment_method || "cash", "pending", totalAmount]
    );

    // COMMIT
    await connection.commit();

    return res.status(201).json({
      message: "Order created successfully",
      order_id: orderId,
      total_amount: totalAmount,
    });
  } catch (error) {
    // ROLLBACK при ошибке
    if (connection) {
      await connection.rollback();
    }

    console.error("Error creating order:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      sql: error.sql,
    });

    if (error.message?.includes("Insufficient stock")) {
      return res.status(409).json({ message: error.message });
    }
    if (error.message?.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message?.includes("Invalid item payload")) {
      return res.status(400).json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: "Error creating order", error: error.sqlMessage || error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 10`);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.execute(`SELECT * FROM orders WHERE order_id = ?`, [id]);

    if (!orders.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];

    const [items] = await db.execute(
      `SELECT oi.order_item_id AS id, oi.product_id, oi.quantity, oi.unit_price, oi.subtotal, p.product_name AS name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [id]
    );

    const [transactions] = await db.execute(`SELECT * FROM transactions WHERE order_id = ?`, [id]);

    res.json({
      ...order,
      items,
      transactions: transactions[0] || null,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [result] = await db.execute(`UPDATE orders SET order_status = ? WHERE order_id = ?`, [
      status,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order_id: id, new_status: status });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
};