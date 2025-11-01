import { useState, useEffect } from "react";
import Fuse from "fuse.js";

const base = process.env.NEXT_PUBLIC_DATA_BASE;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  // Load the prebuilt index.json only once (client-side)
  useEffect(() => {
    fetch(`${base}/index.json`)
      .then((res) => res.json())
      .then((data) => {
        const fuseInstance = new Fuse(data, {
          keys: ["sanskrit", "translation", "itrans", "id"],
          threshold: 0.4,
          includeScore: true,
        });
        setFuse(fuseInstance);
      })
      .catch((err) => console.error("Error loading search index:", err));
  }, []);

  // Search handler
  const onSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!fuse || !value) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(value).slice(0, 20); // limit to top 20 results
    setResults(searchResults.map((r) => r.item));
  };

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search Sanskrit, ITRANS, or English..."
        value={query}
        onChange={onSearch}
      />

      {query && (
        <ul className="search-results">
          {results.map((v) => (
            <li key={v.id}>
              <a href={`${basePath}/verse/${v.id}`}>
                <strong>{v.id}</strong> — {v.sanskrit.slice(0, 30)}…
                <br />
                <small>{v.translation.slice(0, 80)}…</small>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
