const express = require("express");
const { aiCodeReview } = require("../../../aiCodeReview");
const getProblemModel = require("../../models/Problem");
const { getProblemsConnection } = require("../../db/problemsDb");

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, problemId, language = "cpp" } = req.body;
  if (!code || code.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Empty Code! Please provide some code to execute.",
    });
  }

  if (!problemId) {
    return res.status(400).json({
      success: false,
      error: "Problem ID is required for AI review.",
    });
  }

  let problemsConn;
  try {
    problemsConn = getProblemsConnection();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Problems DB not connected",
    });
  }

  try {
    const Problem = getProblemModel(problemsConn);
    const problem = await Problem.findOne({ problemId });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    const review = await aiCodeReview({ problem, code, language });
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error.message ||
        error.toString() ||
        "An error occured while generating feedback",
    });
  }
});

module.exports = router;
