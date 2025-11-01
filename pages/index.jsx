import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SearchBox from "../components/SearchBox";
const base = process.env.NEXT_PUBLIC_DATA_BASE;
export default function Home() {
  const [verses, setVerses] = useState([]);

  useEffect(() => {
    // Load from public/data/index.json (prebuilt search index)
    fetch(`${base}/index.json`)
      .then((res) => res.json())
      .then((data) => setVerses(data))
      .catch((err) => console.error("Error loading verses:", err));
  }, []);

  return (
    <main className="layout">
      <Sidebar />
      <div className="content">
        <SearchBox />
        {verses.length === 0 && <p>Loading verses...</p>}
      </div>
    </main>
  );
}
