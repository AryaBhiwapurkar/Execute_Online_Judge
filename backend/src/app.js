const express = require("express");
const cors = require("cors");
const path = require("path");

const judgeRoutes = require("./modules/judge/judge.routes"); // /api/run + /api/submit

const authRoutes = require("./modules/auth/auth.routes");
const problemsRoutes = require("./modules/problems/problems.routes");
const aiRoutes = require("./modules/ai/ai.routes");
const getProblemModel = require("./models/Problem");
const { getProblemsConnection } = require("./db/problemsDb");

const app = express();

// 🧱 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Static frontend (kept for backwards compatibility)
app.use(express.static(path.join(__dirname, "../../frontend")));

// 🔹 Base route
app.get("/", (req, res) => {
  res.send("Online Judge running");
});

// 🧪 Quick DB check (kept for backwards compatibility)
app.get("/test-problems", async (req, res) => {
  try {
    const Problem = getProblemModel(getProblemsConnection());
    const count = await Problem.countDocuments();

    const conn = getProblemsConnection();
    res.json({
      message: "Problems DB working",
      totalProblems: count,
      dbState: conn.readyState,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Feature routes (paths preserved)
app.use(authRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api", judgeRoutes);
app.use("/ai-review", aiRoutes);

module.exports = { app };
