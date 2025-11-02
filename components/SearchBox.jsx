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
    <div className="flex flex-col items-center justify-center text-center mx-auto my-8 max-w-md w-full">
      <input
        type="text"
        placeholder="Search Sanskrit, ITRANS, or English..."
        value={query}
        onChange={onSearch}
        className="w-full h-8 rounded-md border border-gray-300 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      />

      {query && (
        <ul className="list-none w-full p-0 m-0">
          {results.map((v) => (
            <li className="mb-2 text-left" key={v.id}>
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
