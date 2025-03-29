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

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../Front-end/src/views"));
app.use(express.static(path.resolve(__dirname, "../Front-end/public")));

// Show all books
app.get(["/", "/index", "/home"], async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, author, rating, short_summary, isbn FROM books"
    );
    res.render("index", { books: result.rows });
  } catch (err) {
    console.error(err.message);
  }
});

// Individual focused book
app.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, title, author, rating, long_summary FROM books WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }

    const book = result.rows[0];

    if (!book.long_summary) {
      book.long_summary = "No summary available.";
    }

    res.render("book", { book });
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
