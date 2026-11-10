const $ = (selector) => document.querySelector(selector);
const grid = $("#grid");
const KEY = "ink-with-insights-library-v2";
const CONSENT = "ink-with-insights-consent-v1";

let results = [];
let mode = "discover";
let library = [];

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[char];
  });
}

const consent = localStorage.getItem(CONSENT);
if (!consent) $("#consent").classList.remove("hidden");

if (consent === "yes") {
  try {
    library = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    library = [];
  }
}

function persist() {
  if (localStorage.getItem(CONSENT) !== "yes") return false;
  localStorage.setItem(KEY, JSON.stringify(library));
  $("#saveStatus").textContent = "Saved on this device";
  setTimeout(() => {
    $("#saveStatus").textContent = "";
  }, 1200);
  return true;
}

function normalize(volume) {
  const info = volume.volumeInfo || {};
  const identifiers = info.industryIdentifiers || [];
  const isbn = identifiers.find((item) => item.type === "ISBN_13")?.identifier
    || identifiers[0]?.identifier
    || "";

  return {
    id: volume.id,
    title: info.title || "Untitled",
    authors: info.authors || ["Unknown author"],
    description: info.description || "",
    categories: info.categories || [],
    pageCount: info.pageCount || null,
    publishedDate: info.publishedDate || "",
    publisher: info.publisher || "",
    rating: info.averageRating || null,
    ratingsCount: info.ratingsCount || 0,
    isbn,
    thumbnail: (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "").replace("http://", "https://"),
    previewLink: info.previewLink || "",
    infoLink: info.infoLink || "",
    userRating: 0,
    insight: ""
  };
}

function bookCard(book) {
  const saved = library.some((item) => item.id === book.id);
  const cover = book.thumbnail
    ? '<img loading="lazy" src="' + esc(book.thumbnail) + '" alt="">'
    : '<div class="cover-fallback">' + esc(book.title) + "</div>";

  const chips = book.categories.slice(0, 2)
    .map((category) => '<span class="chip">' + esc(category) + "</span>")
    .join("");

  const preview = book.previewLink
    ? '<a class="btn" href="' + esc(book.previewLink) + '" target="_blank" rel="noreferrer" style="text-decoration:none;text-align:center">Preview</a>'
    : "";

  const year = book.publishedDate ? esc(book.publishedDate.slice(0, 4)) : "Year n/a";
  const pages = book.pageCount ? " · " + book.pageCount + " pages" : "";
  const rating = book.rating ? " · Google " + book.rating + "/5" : "";

  return [
    '<article class="book">',
      '<div class="cover">', cover, "</div>",
      '<div class="book-body">',
        '<div class="title">', esc(book.title), "</div>",
        '<div class="author">', esc(book.authors.join(", ")), "</div>",
        '<div class="meta">', year, pages, rating, "</div>",
        '<div class="chips">', chips, "</div>",
        '<div class="desc">', esc(book.description || "No publisher description available for this edition."), "</div>",
        '<div class="book-actions">',
          '<button class="btn ', saved ? "" : "primary", '" data-save="', esc(book.id), '">', saved ? "Saved" : "Add to library", "</button>",
          preview,
        "</div>",
      "</div>",
    "</article>"
  ].join("");
}

function renderLibrary() {
  const el = $("#libraryList");

  if (!library.length) {
    el.innerHTML = '<div class="empty" style="padding:28px">No saved books yet.</div>';
    return;
  }

  el.innerHTML = library.map((book) => {
    const stars = [1, 2, 3, 4, 5]
      .map((n) => '<span class="star ' + (n <= book.userRating ? "on" : "") + '" data-star="' + n + '">★</span>')
      .join("");

    const info = book.infoLink
      ? '<a class="btn" href="' + esc(book.infoLink) + '" target="_blank" rel="noreferrer" style="text-decoration:none">Book info</a>'
      : "";

    return [
      '<div class="library-item">',
        "<strong>", esc(book.title), "</strong>",
        '<div class="author">', esc(book.authors.join(", ")), "</div>",
        '<div class="rating" data-rating="', esc(book.id), '">', stars,
          '<span class="meta" style="margin-left:6px">', book.userRating ? book.userRating + "/5" : "Rate it", "</span>",
        "</div>",
        '<textarea data-note="', esc(book.id), '" placeholder="The insight I want to remember…">', esc(book.insight || ""), "</textarea>",
        '<div style="display:flex;gap:8px;margin-top:8px">',
          '<button class="btn" data-remove="', esc(book.id), '">Remove</button>',
          info,
        "</div>",
      "</div>"
    ].join("");
  }).join("");
}

function render() {
  let list = results;

  if (mode === "saved") {
    list = library;
  }

  if (mode === "recommended") {
    const categories = [...new Set(library.flatMap((book) => book.categories))].slice(0, 6);
    list = results.filter((book) =>
      book.categories.some((category) =>
        categories.some((savedCategory) =>
          category.toLowerCase().includes(savedCategory.toLowerCase())
        )
      )
    );

    if (!list.length) list = results.slice(0, 8);
  }

  if (!list.length) {
    let message = "Search Google Books to start exploring.";
    if (mode === "saved") message = "Your shelf is empty. Search for a book and save the ones worth remembering.";
    if (mode === "recommended") message = "Save and rate a few books first — recommendations will use their topics and categories.";
    grid.innerHTML = '<div class="empty">' + message + "</div>";
  } else {
    grid.innerHTML = list.map(bookCard).join("");
  }

  $("#count").textContent = String(library.length);
  renderLibrary();
}

function syncTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });

  const copy = {
    discover: ["Discover books", "Live results from Google Books. Nothing is added until you choose it."],
    recommended: ["For you", "Recommendations are based on categories from books you save."],
    saved: ["Saved shelf", "Your personal reading memory, stored only where you consented."]
  }[mode];

  $("#sectionTitle").textContent = copy[0];
  $("#sectionSub").textContent = copy[1];
}

async function search(query) {
  grid.innerHTML = '<div class="empty">Searching books…</div>';

  try {
    const response = await fetch("/api/books?q=" + encodeURIComponent(query));
    if (!response.ok) throw new Error("Search failed with " + response.status);

    const data = await response.json();
    results = (data.items || []).map(normalize);
    mode = "discover";
    syncTabs();
    render();
  } catch (error) {
    console.error("Book search error:", error);
    grid.innerHTML = '<div class="empty">Book search is temporarily unavailable. Try again in a moment.</div>';
  }
}

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = $("#query").value.trim();
  if (query) search(query);
});

document.addEventListener("click", (event) => {
  const save = event.target.closest("[data-save]");
  if (save) {
    if (localStorage.getItem(CONSENT) !== "yes") {
      $("#consent").classList.remove("hidden");
      return;
    }

    const book = results.find((item) => item.id === save.dataset.save)
      || library.find((item) => item.id === save.dataset.save);

    if (book && !library.some((item) => item.id === book.id)) {
      library.unshift({ ...book });
      persist();
      render();
    }
    return;
  }

  const remove = event.target.closest("[data-remove]");
  if (remove) {
    library = library.filter((item) => item.id !== remove.dataset.remove);
    persist();
    render();
    return;
  }

  const star = event.target.closest("[data-star]");
  if (star) {
    const wrap = star.closest("[data-rating]");
    const book = library.find((item) => item.id === wrap.dataset.rating);
    if (book) {
      book.userRating = Number(star.dataset.star);
      persist();
      renderLibrary();
    }
    return;
  }

  const tab = event.target.closest(".tab");
  if (tab) {
    mode = tab.dataset.mode;
    syncTabs();
    render();
  }
});

document.addEventListener("input", (event) => {
  if (!event.target.matches("[data-note]")) return;
  const book = library.find((item) => item.id === event.target.dataset.note);
  if (!book) return;
  book.insight = event.target.value;
  persist();
});

$("#libraryBtn").addEventListener("click", () => {
  $("#drawer").classList.add("open");
  renderLibrary();
});

$("#closeDrawer").addEventListener("click", () => {
  $("#drawer").classList.remove("open");
});

$("#allowLocal").addEventListener("click", () => {
  localStorage.setItem(CONSENT, "yes");
  $("#consent").classList.add("hidden");

  try {
    library = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    library = [];
  }

  render();
});

$("#declineLocal").addEventListener("click", () => {
  localStorage.setItem(CONSENT, "no");
  $("#consent").classList.add("hidden");
});

$("#syncBtn").addEventListener("click", () => {
  alert("Cloud sync is not connected yet because this repo does not have its own Firebase project/config. Search is live and fixed; cloud sync needs a dedicated Firebase project before sign-in and Firestore can be enabled safely.");
});

render();
search("subject:self-help");
