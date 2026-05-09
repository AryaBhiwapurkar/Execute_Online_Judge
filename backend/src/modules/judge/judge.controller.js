const getProblemModel = require("../../models/Problem");
const { getProblemsConnection } = require("../../db/problemsDb");
const { runOnce, judgeAgainstTestcases } = require("./judge.service");

const runHandler = async (req, res) => {
  const { language = "cpp", code, input = "", problemId } = req.body;

  if (!code?.trim()) {
    return res.status(400).json({ status: false, error: "Code is required" });
  }

  // Preserve existing behavior: problemId is required for /api/run
  if (!problemId) {
    return res
      .status(400)
      .json({ status: false, error: "Problem ID is required" });
  }

  try {
    const { output, codePath } = await runOnce({
      language,
      code,
      input,
      timeLimitMs: 1000,
    });

    return res.json({ status: true, output, filePath: codePath });
  } catch (error) {
    console.error("❌ Error in /run:", error);
    return res.status(500).json({
      status: false,
      error: error?.stderr || error?.message || "Unknown error",
    });
  }
};

const submitHandler = async (req, res) => {
  const { language = "cpp", code, problemId } = req.body;

  if (!code?.trim() || !problemId) {
    return res.status(400).json({ verdict: "Missing code or problemId" });
  }

  let problemsConn;
  try {
    problemsConn = getProblemsConnection();
  } catch (err) {
    return res.status(500).json({ verdict: "Problems DB not connected" });
  }

  try {
    const Problem = getProblemModel(problemsConn);
    const problem = await Problem.findOne({ problemId });

    if (!problem || !Array.isArray(problem.testcases)) {
      return res
        .status(404)
        .json({ verdict: "Problem or testcases not found." });
    }

    const { testcases, timeLimit = 1000 } = problem;

    const result = await judgeAgainstTestcases({
      language,
      code,
      testcases,
      timeLimitMs: timeLimit,
    });

    return res.json(result);
  } catch (error) {
    console.error("❌ Error in /submit:", error);
    return res.status(500).json({
      verdict: "Server Error",
      debug: error?.message || "Unknown error",
    });
  }
};

module.exports = { runHandler, submitHandler };
