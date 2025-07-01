const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

// ✅ Create "codes" folder if it doesn't exist
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (language, code) => {
  const jobId = uuid();

  // Language-specific filename
  let filename;
  switch (language) {
    case "cpp":
      filename = `${jobId}.cpp`;
      break;
    
    case "py":
      filename = `script_${jobId}.py`; // Avoid clashing
      break;
    case "java":
      filename = `Main_${jobId}.java`; // Save as Main, but unique
      break;
    default:
      throw new Error("❌ Unsupported language for file generation");
  }

  const filePath = path.join(dirCodes, filename);
  fs.writeFileSync(filePath, code);
  return filePath;
};

module.exports = { generateFile };
