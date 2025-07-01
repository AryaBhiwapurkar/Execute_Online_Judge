const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");

const { generateFile } = require("./generateFile");
const { generateInputFile } = require("./generateInputFile");

const { executeCpp } = require("./executeCpp");
const { executePython } = require("./executePython");

const { authMiddleware } = require("../middleware/authMiddleware");
const getProblemModel = require("../Models/Problem");

// 🧪 Compile + Run with custom input
router.post("/run", authMiddleware, async (req, res) => {
  const { language = "cpp", code, input = "", problemId } = req.body;

  if (!code?.trim()) {
    return res.status(400).json({ status: false, error: "Code is required" });
  }

  if (!problemId) {
    return res
      .status(400)
      .json({ status: false, error: "Problem ID is required" });
  }

  try {
    const filePath = generateFile(language, code);
    const inputFilePath = generateInputFile(input);

    let output;
    switch (language) {
      case "cpp":
        output = await executeCpp(filePath, inputFilePath);
        break;
      case "py":
        output = await executePython(filePath, inputFilePath);
        break;
      default:
        return res.status(400).json({ status: false, error: "Unsupported language" });
    }

    return res.json({
      status: true,
      output: (output || "").trim(),
      filePath,
    });
  } catch (error) {
    console.error("❌ Error in /run:", error);
    return res.status(500).json({
      status: false,
      error: error?.stderr || error?.message || "Unknown error",
    });
  }
});

// ✅ Submit: Judge against hidden testcases
router.post("/submit", authMiddleware, async (req, res) => {
  const { language = "cpp", code, problemId } = req.body;

  if (!code?.trim() || !problemId) {
    return res.status(400).json({ verdict: "Missing code or problemId" });
  }

  try {
    const Problem = getProblemModel(global.problemDB);
    const problem = await Problem.findOne({ problemId });

    if (!problem || !Array.isArray(problem.testcases)) {
      return res
        .status(404)
        .json({ verdict: "Problem or testcases not found." });
    }

    const { testcases, timeLimit = 1000, memoryLimit = 256 } = problem;
    const codePath = generateFile(language, code);

    for (let i = 0; i < testcases.length; i++) {
      const inputStr = testcases[i]?.input || "";
      const expectedOutputStr = testcases[i]?.output || "";

      const inputPath = generateInputFile(inputStr);

      let rawOutput;
      try {
        switch (language) {
          case "cpp":
            rawOutput = await executeCpp(codePath, inputPath, timeLimit, memoryLimit);
            break;
          case "py":
            rawOutput = await executePython(codePath, inputPath, timeLimit, memoryLimit);
            break;
          case "java":
            rawOutput = await executeJava(codePath, inputPath, timeLimit, memoryLimit);
            break;
          default:
            return res.status(400).json({ verdict: "Unsupported language" });
        }
      } catch (err) {
        const isTLE = err.signal === "SIGKILL" || err.killed;
        const msg = err.stderr || err.message;

        return res.json({
          verdict: isTLE ? "TLE" : "Runtime Error",
          failedTest: i + 1,
          error: msg,
        });
      }

      const actualOutput = (rawOutput || "").trim();
      const expectedOutput = (expectedOutputStr || "").trim();

      if (actualOutput.includes("Memory limit exceeded")) {
        return res.json({ verdict: "MLE", failedTest: i + 1 });
      }

      if (actualOutput.includes("Time limit exceeded")) {
        return res.json({ verdict: "TLE", failedTest: i + 1 });
      }

      if (actualOutput !== expectedOutput) {
        return res.json({ verdict: "Wrong Answer", failedTest: i + 1 });
      }
    }

    return res.json({ verdict: "Accepted" });
  } catch (error) {
    console.error("❌ Error in /submit:", error);
    return res.status(500).json({
      verdict: "Server Error",
      debug: error?.message || "Unknown error",
    });
  }
});

module.exports = router;
