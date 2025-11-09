// lib/loadCommentaries.js
export async function loadCommentaries({ base, authors, type, id }) {
  // type = "verse" or "chapter"
  if (!base || !Array.isArray(authors) || !id) {
    console.warn("⚠️ Missing parameters in loadCommentaries");
    return [];
  }

  const results = await Promise.all(
    authors.map(async (author) => {
      const url = `${base}/commentaries/${author}/${type}/${id}.json`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`⚠️ Commentary not found: ${author}/${type}/${id}`);
          return null;
        }
        const text = await res.text();
        if (text.trim().startsWith("<")) {
          console.warn(`⚠️ Commentary returned HTML: ${url}`);
          return null;
        }
        const data = JSON.parse(text);
        return { author, ...data };
      } catch (err) {
        console.warn(`⚠️ Failed to load ${author}/${type}/${id}:`, err.message);
        return null;
      }
    })
  );

  return results.filter(Boolean);
}
