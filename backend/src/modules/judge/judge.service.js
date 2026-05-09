const { generateFile } = require("../../compiler/generateFile");
const { generateInputFile } = require("../../compiler/generateInputFile");
const { executeCpp } = require("../../compiler/executeCpp");
const { executePython } = require("../../compiler/executePython");

const executeByLanguage = async ({ language, codePath, inputPath, timeLimitMs }) => {
  switch (language) {
    case "cpp":
      return executeCpp(codePath, inputPath, timeLimitMs);
    case "py":
      return executePython(codePath, inputPath, timeLimitMs);
    default:
      throw new Error("Unsupported language");
  }
};

const runOnce = async ({ language = "cpp", code, input = "", timeLimitMs = 1000 }) => {
  const codePath = generateFile(language, code);
  const inputPath = generateInputFile(input);

  const rawOutput = await executeByLanguage({
    language,
    codePath,
    inputPath,
    timeLimitMs,
  });

  return {
    codePath,
    output: (rawOutput || "").toString().trim(),
    rawOutput: (rawOutput || "").toString(),
  };
};

const judgeAgainstTestcases = async ({
  language = "cpp",
  code,
  testcases,
  timeLimitMs = 1000,
}) => {
  const codePath = generateFile(language, code);

  for (let i = 0; i < testcases.length; i++) {
    const inputStr = testcases[i]?.input || "";
    const expectedOutputStr = testcases[i]?.output || "";
    const inputPath = generateInputFile(inputStr);

    const rawOutput = await executeByLanguage({
      language,
      codePath,
      inputPath,
      timeLimitMs,
    });

    const raw = (rawOutput || "").toString();
    const actual = raw.trim();
    const expected = (expectedOutputStr || "").toString().trim();

    if (/^TLE:/i.test(raw) || /time\s*limit\s*exceeded/i.test(raw)) {
      return { verdict: "TLE", failedTest: i + 1 };
    }

    if (/^MLE:/i.test(raw) || /memory\s*limit\s*exceeded/i.test(raw)) {
      return { verdict: "MLE", failedTest: i + 1 };
    }

    if (/^Compilation Error:/i.test(raw)) {
      return {
        verdict: "Compilation Error",
        failedTest: i + 1,
        error: raw,
      };
    }

    if (/^Runtime Error:/i.test(raw)) {
      return {
        verdict: "Runtime Error",
        failedTest: i + 1,
        error: raw,
      };
    }

    if (actual !== expected) {
      return { verdict: "Wrong Answer", failedTest: i + 1 };
    }
  }

  return { verdict: "Accepted" };
};

module.exports = { runOnce, judgeAgainstTestcases };
