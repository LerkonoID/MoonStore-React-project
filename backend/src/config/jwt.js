const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable is required in production");
  }
  console.warn(
    "WARNING: JWT_SECRET is not set. Using an insecure default – set JWT_SECRET in .env before deploying to production."
  );
}

module.exports = {
  JWT_SECRET: JWT_SECRET || "moonstore_dev_secret_change_in_production",
  JWT_EXPIRES_IN: "7d",
};
