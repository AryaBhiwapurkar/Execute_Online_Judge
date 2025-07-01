const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const getProblemModel = require("../Models/Problem");
const { generateFile } = require("./generateFile");
const { generateInputFile } = require("./generateInputFile");
const { executeCpp } = require("./executeCpp");

console.log("✅ submit.js loaded");

router.post("/", authMiddleware, async (req, res) => {
  const { language = "cpp", code, problemId } = req.body;

  if (!code || !problemId) {
    return res
      .status(400)
      .json({ status: false, error: "Code and problemId are required." });
  }

  try {
    const Problem = getProblemModel(global.problemDB);
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res
        .status(404)
        .json({ status: false, error: "Problem not found" });
    }

    const testcases = problem.testcases;

    for (let i = 0; i < testcases.length; i++) {
      const { input, output: expected } = testcases[i];
      const filePath = generateFile(language, code);
      const inputFilePath = generateInputFile(input);

      try {
        const actualOutput = await executeCpp(filePath, inputFilePath);
        const actualTrimmed = (actualOutput || "").trim();
        const expectedTrimmed = (expected || "").trim();

        if (actualTrimmed !== expectedTrimmed) {
          return res.json({
            status: true,
            verdict: "Wrong Answer",
            failedTest: i + 1,
          });
        }
      } catch (err) {
        if (err.killed === true || err.signal === "SIGKILL") {
          return res.json({
            status: true,
            verdict: "Time Limit Exceeded",
            failedTest: i + 1,
          });
        }

        return res.json({
          status: true,
          verdict: "Runtime Error",
          error: err.stderr || err.message,
          failedTest: i + 1,
        });
      }
    }

    return res.json({
      status: true,
      verdict: "Accepted",
    });
  } catch (err) {
    console.error("❌ Error in submit route:", err);
    return res
      .status(500)
      .json({ status: false, error: "Internal server error" });
  }
});

module.exports = router;
