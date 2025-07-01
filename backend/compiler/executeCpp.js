const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath, inputFilePath, timeLimitMs = 1000) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outputExecutable = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve) => {
    const compileCmd = `g++ "${filePath}" -o "${outputExecutable}"`;

    exec(compileCmd, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return resolve(`Compilation Error: ${compileStderr || compileErr.message}`);
      }

      const child = spawn(outputExecutable);

      // Kill after timeout
      const timeoutId = setTimeout(() => {
        child.kill("SIGKILL");
      }, timeLimitMs);

      // Stream input
      const inputStream = fs.createReadStream(inputFilePath);
      inputStream.pipe(child.stdin);

      let output = "";
      let errorOutput = "";

      child.stdout.on("data", (data) => {
        output += data.toString();
      });

      child.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      child.on("close", (code, signal) => {
        clearTimeout(timeoutId);

        if (signal === "SIGKILL" || signal === "SIGTERM") {
          return resolve("TLE: Time Limit Exceeded");
        }

        if (errorOutput.includes("Killed")) {
          return resolve("MLE: Memory Limit Exceeded");
        }

        if (code !== 0) {
          return resolve(`Runtime Error: ${errorOutput || "Non-zero exit code"}`);
        }

        return resolve(output.trim() || "No output");
      });
    });
  });
};

module.exports = { executeCpp };
