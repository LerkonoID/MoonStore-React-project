const db = require("./src/db/connection");

async function main() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    for (const product of products) {
      // 1. ищем категорию
      const [catRows] = await db.query(
        "SELECT id FROM categories WHERE name = ?",
        [product.category]
      );

      let categoryId;

      if (catRows.length > 0) {
        categoryId = catRows[0].id;
      } else {
        const [catResult] = await db.query(
          "INSERT INTO categories (name) VALUES (?)",
          [product.category]
        );
        categoryId = catResult.insertId;
      }

      // 2. вставляем товар
      await db.query(
        `INSERT INTO products 
          (fake_store_id, name, description, price, image_url, category_id, rating_rate, rating_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          description = VALUES(description),
          price = VALUES(price),
          image_url = VALUES(image_url),
          category_id = VALUES(category_id),
          rating_rate = VALUES(rating_rate),
          rating_count = VALUES(rating_count)`,
        [
          product.id,
          product.title,
          product.description,
          product.price,
          product.image,
          categoryId,
          product.rating?.rate ?? null,
          product.rating?.count ?? null,
        ]
      );
    }

    console.log("Fake Store API data imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
}

main();