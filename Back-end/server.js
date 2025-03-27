import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import pool from "./db.js"; // Keep your DB import
import dotenv from "dotenv";

// Resolve the correct path for .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to load .env from the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("✅ ENV Loaded:", process.env.DB_USER, process.env.DB_PASS);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../Front-end/src/views"));
app.use(express.static(path.resolve(__dirname, "../Front-end/public")));

// Show all books
app.get(["/", "/index", "/home"], async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, author, rating, short_summary FROM books"
    );
    res.render("index", { books: result.rows });
  } catch (err) {
    console.error(err.message);
  }
});

// Show one book's detailed view

app.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    const book = result.rows[0];

    if (!book) return res.status(404).send("Book not found");

    res.render("book", { book });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
