const cache = new Map();

export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing q' });

  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < 10 * 60 * 1000) {
    res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=86400');
    return res.status(200).json(hit.data);
  }

  const url = 'https://www.googleapis.com/books/v1/volumes?q=' +
    encodeURIComponent(q) + '&maxResults=24&printType=books';

  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'InkWithInsights/1.0' } });
      if (r.status === 429) {
        lastErr = new Error('Google Books rate limited');
        await new Promise(x => setTimeout(x, 400 * (attempt + 1)));
        continue;
      }
      if (!r.ok) throw new Error('Google Books returned ' + r.status);
      const data = await r.json();
      cache.set(key, { t: Date.now(), data });
      res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=86400');
      return res.status(200).json(data);
    } catch (e) { lastErr = e; }
  }

  // Graceful fallback: Open Library search
  try {
    const r = await fetch('https://openlibrary.org/search.json?q=' + encodeURIComponent(q) + '&limit=24');
    if (!r.ok) throw new Error('Open Library returned ' + r.status);
    const d = await r.json();
    const items = (d.docs || []).map(x => ({
      id: x.key || (x.edition_key && x.edition_key[0]) || Math.random().toString(36),
      volumeInfo: {
        title: x.title,
        authors: x.author_name || ['Unknown author'],
        publishedDate: x.first_publish_year ? String(x.first_publish_year) : '',
        pageCount: x.number_of_pages_median || null,
        categories: (x.subject || []).slice(0, 3),
        industryIdentifiers: x.isbn?.[0] ? [{ type:'ISBN_13', identifier:x.isbn[0]}] : [],
        imageLinks: x.cover_i ? { thumbnail: 'https://covers.openlibrary.org/b/id/' + x.cover_i + '-L.jpg' } : undefined,
        infoLink: x.key ? 'https://openlibrary.org' + x.key : ''
      }
    }));
    const data = { items, source: 'openlibrary-fallback', warning: lastErr?.message };
    res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(503).json({ error:'Book search temporarily unavailable', detail:String(lastErr?.message||e.message) });
  }
}