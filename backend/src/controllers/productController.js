const db = require("../db/connection");

const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.execute(`
      SELECT
        p.product_id AS id,
        p.product_name AS name,
        p.description,
        p.price,
        p.image_url,
        p.category_id,
        p.stock_quantity,
        p.rating,
        p.review_count,
        c.category_name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.is_active = 1
      ORDER BY p.created_at DESC
    `);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.execute(
      `
      SELECT
        p.product_id AS id,
        p.product_name AS name,
        p.description,
        p.price,
        p.image_url,
        p.category_id,
        p.stock_quantity,
        p.rating,
        p.review_count,
        c.category_name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ? AND p.is_active = 1
      `,
      [id]
    );

    if (!products.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(products[0]);
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};