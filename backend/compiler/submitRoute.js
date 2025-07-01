const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const getProblemModel = require('../Models/Problem');

router.post('/submit', authMiddleware, async (req, res) => {
  const { language = 'cpp', code, problemId } = req.body;

  if (!code || !problemId) {
    return res.status(400).json({ status: false, error: "Code and problemId are required" });
  }

  try {
    const Problem = getProblemModel(global.problemDB); // ✅ Use correct DB
    const problem = await Problem.findOne({ problemId });

    if (!problem) {
      return res.status(404).json({ status: false, error: "Problem not found" });
    }

    const { testcases, timeLimit, memoryLimit } = problem;
    if (!testcases || testcases.length === 0) {
      return res.status(400).json({ status: false, error: "No testcases available" });
    }

    // Placeholder response for now
    return res.json({ status: true, message: "Testcases fetched successfully", count: testcases.length });

  } catch (err) {
    console.error("Error in /submit:", err);
    return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

module.exports = router;
