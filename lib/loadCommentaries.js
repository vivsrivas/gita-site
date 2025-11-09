// lib/loadCommentaries.js
export async function loadCommentaries({ type, id, authors, base }) {
  const results = [];

  for (const author of authors) {
    const url =
      type === "chapter"
        ? `${base}/commentaries/${author}/chapters/${id}.json`
        : `${base}/commentaries/${author}/verses/${id}.json`;

    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      if (text.trim().startsWith("<")) continue;

      const data = JSON.parse(text);
      results.push({ author, ...data });
    } catch (err) {
      console.warn(`⚠️ Failed to load ${type} commentary for ${author}/${id}:`, err.message);
    }
  }

  return results;
}
