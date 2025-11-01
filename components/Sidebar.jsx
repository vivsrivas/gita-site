import { useState, useEffect } from "react";

const base = process.env.NEXT_PUBLIC_DATA_BASE;
export default function Sidebar({ onSelect }) {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    // Fetch from public/data/chapters.json
    fetch(`${base}/chapters.json`)
      .then((res) => res.json())
      .then((data) => setChapters(data))
      .catch((err) => console.error("Error loading chapters:", err));
  }, []);

  return (
    <aside className="sidebar">
      <h3>Chapters (Adhyāyas)</h3>
      {chapters.map((ch) => (
        <div key={ch.id} className="chapter">
          <h4>{ch.title}</h4>
          <ul>
            {ch.verses.map((id) => (
              <li key={id}>
                <a href={`/verse/${id}`} onClick={() => onSelect?.()}>
                  {id}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
