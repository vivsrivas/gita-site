import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

const base =
  process.env.DATA_BASE ||
  process.env.NEXT_PUBLIC_DATA_BASE ||
  "https://vivsrivas.github.io/gita-data";

export async function getStaticProps() {
  const safeFetchJSON = async (url, label) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const text = await res.text();
      if (text.trim().startsWith("<")) return [];
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [chapters, verses] = await Promise.all([
    safeFetchJSON(`${base}/chapters.json`, "Chapters"),
    safeFetchJSON(`${base}/index.json`, "Verses"),
  ]);

  return {
    props: {
      chapters,
      verses,
    },
  };
}

export default function Home({ chapters: initialChapters = [], verses: initialVerses = [] }) {
  const [chapters, setChapters] = useState(initialChapters);
  const [verses, setVerses] = useState(initialVerses);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔹 Re-fetch data on client mount to ensure hydration updates work
  useEffect(() => {
    const loadData = async () => {
      try {
        const [chaptersRes, versesRes] = await Promise.all([
          fetch(`${base}/chapters.json`).then((r) => r.json()),
          fetch(`${base}/index.json`).then((r) => r.json()),
        ]);
        setChapters(chaptersRes);
        setVerses(versesRes);
      } catch (err) {
        console.error("Error reloading data on client:", err);
      }
    };
    loadData();
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 pt-[64px]">
        <Sidebar
          chapters={chapters}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center">
          {/* 🔹 Search Section */}
          <div className="w-full max-w-2xl mt-4">
            {verses.length > 0 ? (
            <SearchBox verses={verses} />
            ) : (
              <p className="text-gray-500 text-center">Loading verses...</p>
            )}
          </div>

          {/* 🔹 Optional: welcome / description */}
          <div className="mt-8 text-center max-w-2xl text-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-[#c77d28]">
              Welcome to the Bhagavad Gita
            </h2>
            <p>
              Explore all 18 chapters and 700 verses of the Bhagavad Gita with
              translations and commentaries.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
