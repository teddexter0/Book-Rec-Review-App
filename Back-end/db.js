import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly specify the .env path
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Debugging logs to confirm env variables are available
console.log("🔴 DB_USER in db.js:", process.env.DB_USER);
console.log("🔴 DB_PASS in db.js:", process.env.DB_PASS);

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

export default pool;
