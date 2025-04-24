import express from "express";
import fetch from "node-fetch"; // or axios if you prefer that

const router = express.Router();
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Helper function for Hugging Face Inference API
async function queryHuggingFace(model, inputs) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs }),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      `Hugging Face error: ${response.status} - ${response.statusText}`
    );
  }
  return result;
}

// Route to get genres
router.get("/", async (req, res) => {
  try {
    const prompt = `
      Suggest 10 random popular book genres.
      Return the result ONLY in this JSON format:
      ["Self-Help", "Christian", "Non-Fiction", "Fantasy", "Science Fiction", "Mystery", "Romance", "Horror", "Thriller", "Biography"]
    `.trim();

    const output = await queryHuggingFace(
      "distilgpt2", // Use smaller model instead of the large one
      prompt
    );

    const raw = output?.[0]?.generated_text || "";
    const match = raw.match(/\[.*?\]/s);
    const genres = match ? JSON.parse(match[0]) : [];

    res.render("ai", { genres });
  } catch (error) {
    console.error("❌ Genre API error:", error.message);
    res.render("ai", { genres: [] });
  }
});

// Route to get books by genre

router.get("/book/:genre", async (req, res) => {
  const genre = req.params.genre;

  try {
    const prompt = `
      Suggest 5 books from the genre "${genre}". 
      Include:
      - Title
      - Author
      - ISBN (if available)
      - A short summary (max 120 words)
      - An approximate rating out of 10

      Return ONLY in this JSON format:
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

    // Get book recommendations from the AI
    const output = await queryHuggingFace("distilgpt2", prompt); // Ensure this method works with your Hugging Face API
    const raw = output?.[0]?.generated_text || "";
    const match = raw.match(/\[.*?\]/s);
    const books = match ? JSON.parse(match[0]) : [];

    // Shuffle the books to randomize the order
    books.sort(() => Math.random() - 0.5);

    // Send back the books as JSON
    res.json({ books, genre });
  } catch (error) {
    console.error("❌ Book API error:", error);
    res.json({ books: [], genre });
  }
});

export default router;
