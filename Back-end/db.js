import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly specify the .env path
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const isProduction = process.env.NODE_ENV === "production"; // Check environment

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || null, // Use DATABASE_URL on Render
  ssl: isProduction ? { rejectUnauthorized: false } : false, // Fix SSL on Render
  user: process.env.DB_USER || undefined, // Fallback to local env vars
  host: process.env.DB_HOST || undefined,
  database: process.env.DB_NAME || undefined,
  password: process.env.DB_PASS || undefined,
  port: process.env.DB_PORT || undefined,
});

export default pool;
