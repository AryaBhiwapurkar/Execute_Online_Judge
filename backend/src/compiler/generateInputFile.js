const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirInput = path.join(__dirname, "input");

// ✅ Create the input directory if it doesn't exist
if (!fs.existsSync(dirInput)) {
  fs.mkdirSync(dirInput, { recursive: true });
}

const generateInputFile = (input) => {
  const jobId = uuid();
  const inputFileName = `${jobId}.txt`;
  const inputFilePath = path.join(dirInput, inputFileName);

  // ✅ Normalize input: decode escaped newlines only if input is a string
  let inputData = "";
  if (typeof input === "string") {
    inputData = input.replace(/\\n/g, "\n"); // e.g., "4\\n1 2" => "4\n1 2"
  } else if (input !== undefined && input !== null) {
    inputData = String(input);
  }

  fs.writeFileSync(inputFilePath, inputData, "utf-8");
  return inputFilePath;
};

module.exports = { generateInputFile };
