const { spawn } = require("child_process");
const fs = require("fs");

// 👇 Automatically choose 'python' on Windows and 'python3' elsewhere
const PYTHON_CMD = process.platform === "win32" ? "python" : "python3";

const executePython = (filePath, inputFilePath, timeLimit = 1000) => {
  return new Promise((resolve) => {
    const pythonProcess = spawn(PYTHON_CMD, [filePath]);

    // Kill process after timeLimit
    const timeoutId = setTimeout(() => {
      pythonProcess.kill("SIGKILL");
    }, timeLimit);

    // Pipe input file to Python process
    const inputStream = fs.createReadStream(inputFilePath);
    inputStream.pipe(pythonProcess.stdin);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code, signal) => {
      clearTimeout(timeoutId);

      if (signal === "SIGKILL" || signal === "SIGTERM") {
        return resolve("TLE: Time Limit Exceeded");
      }

      if (errorOutput.includes("MemoryError")) {
        return resolve("MLE: Memory Limit Exceeded");
      }

      if (code !== 0) {
        return resolve(`Runtime Error: ${errorOutput.trim() || "Unknown error"}`);
      }

      return resolve(output.trim() || "No output");
    });
  });
};

module.exports = { executePython };
