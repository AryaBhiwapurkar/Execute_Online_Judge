const { app } = require("./app");
const { connectAuthDB } = require("./db/authDb");
const { connectProblemsDB } = require("./db/problemsDb");
require("./config/env");

const startServer = async () => {
  await connectAuthDB();
  console.log("✅ Auth DB connected");

  const problemsConn = await connectProblemsDB();
  console.log("✅ Problems DB connected");
  console.log("Connected to:", problemsConn.name);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

// Allow requiring without auto-start in tests/tools
if (require.main === module) {
  startServer().catch((err) => {
    console.error("❌ Failed to initialize app:", err);
    process.exit(1);
  });
}

module.exports = { startServer };
