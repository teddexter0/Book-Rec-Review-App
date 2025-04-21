import express from "express";
import OpenAI from "openai"; // Using new v4 SDK
import dotenv from "dotenv";

dotenv.config();

// Set up OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const router = express.Router();

// 🔹 STEP 1: Get 10 book genres
router.get("/", async (req, res) => {
  try {
    const genrePrompt = `
      Suggest 10 random popular book genres.
      Return the result ONLY in this JSON format:
      ["Self-Help", "Christian", "Non-Fiction", "Fantasy", "Science Fiction", "Mystery", "Romance", "Horror", "Thriller", "Biography"]
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: genrePrompt }],
      temperature: 0.7,
    });

    let genres = [];
    try {
      genres = JSON.parse(response.choices[0].message.content.trim());
    } catch (parseError) {
      console.error("❌ Genre parse error:", parseError);
    }

    res.render("ai", { genres });
  } catch (error) {
    const err = error?.response?.data?.error;
    console.error(
      "❌ Genre API error:",
      err?.message || error.message || error
    );
    res.render("ai", { genres: [] });
  }
});

// 🔹 STEP 2: Get 5 books from selected genre
router.get("/books/:genre", async (req, res) => {
  try {
    const genre = req.params.genre;
    const bookPrompt = `
      Suggest 5 books from the genre "${genre}". 
      Include:
      - Title
      - Author
      - ISBN (if available)
      - A short summary (max 120 words)
      - An approximate rating out of 10

      Return the result ONLY in this JSON format:
      [
        {
          "title": "Book Title",
          "author": "Author Name",
          "isbn": "ISBN_NUMBER",
          "rating": 8.5,
          "short_summary": "A brief description of the book."
        }
      ]
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: bookPrompt }],
      temperature: 0.8,
    });

    let books = [];
    try {
      books = JSON.parse(response.choices[0].message.content.trim());
    } catch (parseError) {
      console.error("❌ Book parse error:", parseError);
    }

    res.render("book", { books, genre });
  } catch (error) {
    const err = error?.response?.data?.error;
    console.error("❌ Book API error:", err?.message || error.message || error);
    res.render("book", { books: [], genre });
  }
});

export default router;
