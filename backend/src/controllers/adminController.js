const db = require("../db/connection");

const SAFE_USER_FIELDS =
  "user_id, username, email, full_name, phone, city, country, role, is_active, created_at";

const listUsers = async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT ${SAFE_USER_FIELDS} FROM users ORDER BY created_at DESC`
    );
    return res.json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["admin", "operator", "seller", "buyer", "guest"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [result] = await db.execute("UPDATE users SET role = ? WHERE user_id = ?", [role, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await db.execute(
        `INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
         VALUES (?, 'update_role', 'users', ?, ?)`,
        [req.user.user_id, id, JSON.stringify({ role })]
      );
    } catch (_) {}

    return res.json({ message: "Role updated", user_id: id, role });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ message: "Error updating role" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined || (is_active !== 0 && is_active !== 1)) {
      return res.status(400).json({ message: "is_active must be 0 or 1" });
    }

    const [result] = await db.execute(
      "UPDATE users SET is_active = ? WHERE user_id = ?",
      [is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await db.execute(
        `INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
         VALUES (?, 'update_status', 'users', ?, ?)`,
        [req.user.user_id, id, JSON.stringify({ is_active })]
      );
    } catch (_) {}

    return res.json({ message: "Status updated", user_id: id, is_active });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ message: "Error updating status" });
  }
};

module.exports = { listUsers, updateUserRole, updateUserStatus };
