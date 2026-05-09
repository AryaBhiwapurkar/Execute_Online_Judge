const path = require("path");
const dotenv = require("dotenv");

// Load backend/.env explicitly (works regardless of cwd)
dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  env: process.env,
};
