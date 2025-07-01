// 3. Fixed database/problemAPI.js
const express = require("express");
const router = express.Router();
const getProblemModel = require("../Models/Problem");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// @route   GET /api/problems
// @desc    Get all problems (basic list)
// @access  Public
router.get("/", async (req, res) => {
  try {
    if (!global.problemDB) {
      return res.status(500).json({ message: "Problems database not connected" });
    }

    const Problem = getProblemModel(global.problemDB);
    const problems = await Problem.find({}, "problemId title difficulty");

    res.json(problems);
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/problems/:id
// @desc    Get single problem by problemId
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    if (!global.problemDB) {
      return res.status(500).json({ message: "Problems database not connected" });
    }

    const Problem = getProblemModel(global.problemDB);
    const problem = await Problem.findOne({ problemId: req.params.id });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    console.error("Error fetching problem:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST /api/problems
// @desc    Add new problem (admin only)
// @access  Private/Admin
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    if (!global.problemDB) {
      return res.status(500).json({ message: "Problems database not connected" });
    }

    const Problem = getProblemModel(global.problemDB);

    const {
      problemId,
      title,
      difficulty,
      problemStatement,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput,
      
    } = req.body;

    const existing = await Problem.findOne({ problemId });
    if (existing) {
      return res.status(400).json({ message: "Problem ID already exists" });
    }

    const problem = new Problem({
      problemId,
      title,
      difficulty,
      problemStatement,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput,
    });

    await problem.save();
    res.status(201).json({ message: "Problem added successfully", problem });
  } catch (error) {
    console.error("Error adding problem:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/problems/:id
// @desc    Delete problem (admin only)
// @access  Private/Admin
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    if (!global.problemDB) {
      return res.status(500).json({ message: "Problems database not connected" });
    }

    const Problem = getProblemModel(global.problemDB);
    const problem = await Problem.findOneAndDelete({ problemId: req.params.id });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
