const { startServer } = require("./src/server");

startServer().catch((err) => {
  console.error("❌ Failed to initialize app:", err);
  process.exit(1);
});
