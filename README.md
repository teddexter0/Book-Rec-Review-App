# Book-Rec-Review-App
# Ink With Insights - Book Collection App

A personal book collection web application that helps you remember and share the key insights from your non-fiction reads. This application displays book details including titles, authors, ratings, and summaries, along with book covers fetched from the Open Library API.

![Ink With Insights Logo](Front-end/public/images/cover.png)

## Features

- Display your personal book collection with ratings and summaries
- Fetch book covers automatically using ISBN numbers from the Open Library API
- View detailed information about each book on its own page
- Responsive design for various device sizes
- Simple, clean interface focused on book content

## Tech Stack

- **Frontend**: EJS templates, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Build Tools**: Webpack
- **APIs**: Open Library Covers API

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ink-with-insights.git
   cd ink-with-insights
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # For local development
   DB_USER=your_db_username
   DB_HOST=localhost
   DB_NAME=book_collection
   DB_PASS=your_db_password
   DB_PORT=5432
   
   # For production
   # DATABASE_URL=your_production_db_url
   
   PORT=3000
   ```

4. Set up your PostgreSQL database:
   ```sql
   CREATE TABLE books (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     author VARCHAR(255) NOT NULL,
     rating INTEGER,
     short_summary TEXT,
     long_summary TEXT,
     isbn VARCHAR(13)
   );
   
   -- Sample insertion
   INSERT INTO books (title, author, rating, short_summary, long_summary, isbn)
   VALUES (
     'Atomic Habits',
     'James Clear',
     9,
     'A guide on how to build good habits and break bad ones.',
     'Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
     '0735211299'
   );
   ```

## Building and Running the Application

1. Build the frontend assets:
   ```bash
   npm run build
   ```

2. Start the application:
   ```bash
   npm start
   ```
   
3. For development with automatic reloading:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Project Structure

```
ink-with-insights/
├── Back-end/
│   ├── db.js         # Database connection
│   └── server.js     # Express server setup
├── Front-end/
│   ├── public/       # Compiled static assets (generated by webpack)
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   └── fonts/
│   └── src/
│       ├── dom.js    # Frontend JavaScript
│       ├── images/   # Source images
│       ├── fonts/    # Font files
│       └── views/    # EJS templates
│           ├── index.ejs
│           ├── book.ejs
│           └── partials/
│               ├── header.ejs
│               └── footer.ejs
├── .env              # Environment variables (create this)
├── package.json      # Dependencies and scripts
├── webpack.config.js # Webpack configuration
└── README.md         # This file
```

## Book Cover API Usage

This application uses the Open Library Covers API to fetch book covers based on ISBN numbers. The API endpoint format is:

```
https://covers.openlibrary.org/b/isbn/{ISBN}-M.jpg
```

Where:
- `{ISBN}` is the book's ISBN number
- `-M` indicates a medium-sized cover image (other options: `-S` for small, `-L` for large)

## Deployment

This application is set up to be easily deployed to platforms like Render or Heroku:

1. Create a new web service on your hosting platform
2. Connect your repository
3. Set environment variables including `DATABASE_URL` and `PORT`
4. Deploy the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Open Library API for providing book cover images
- All the authors of the books featured in this collection