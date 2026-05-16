const express = require("express");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { runHandler, submitHandler } = require("./judge.controller");
const { getQueueStats } = require("../../queue/queueMonitor");

const router = express.Router();

router.post("/run", authMiddleware, runHandler);
router.post("/submit", authMiddleware, submitHandler);
router.get("/queue-stats", async (req, res) => {
  try {
    const stats = await getQueueStats();
    return res.json(stats);
  } catch (error) {
    console.error("❌ Error getting queue stats:", error);
    return res.status(500).json({ error: "Failed to fetch queue stats" });
  }
});

module.exports = router;
