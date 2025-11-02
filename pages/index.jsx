import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Search } from "lucide-react";
import SearchBox from "../components/SearchBox";

const base =
  process.env.DATA_BASE ||  // visible to Node during build & dev
  process.env.NEXT_PUBLIC_DATA_BASE || 
  "https://vivsrivas.github.io/gita-data";
  
/**
 * ✅ Build-time data fetch (so export never fails)
 */
export async function getStaticProps() {
  const safeFetchJSON = async (url, label) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`⚠️ ${label} not found (${res.status}): ${url}`);
        return [];
      }

      const text = await res.text();
      if (!text.trim() || text.trim().startsWith("<")) {
        console.warn(`⚠️ ${label} returned invalid or HTML content: ${url}`);
        return [];
      }

      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn(`⚠️ Failed to load ${label}:`, err.message);
      return [];
    }
  };

  let chapters = [];
  let verses = [];

  try {
    [chapters, verses] = await Promise.all([
      safeFetchJSON(`${base}/chapters.json`, "Chapters"),
      safeFetchJSON(`${base}/index.json`, "Verses"),
    ]);
  } catch (err) {
    console.error("❌ getStaticProps failed:", err);
  }

  // ✅ Ensure we always return valid props
  return {
    props: {
      chapters: Array.isArray(chapters) ? chapters : [],
      verses: Array.isArray(verses) ? verses : [],
    },
  };
}
export default function Home() {
  const [verses, setVerses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen overflow-hidden">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 pt-[64px]">
        <Sidebar
          chapters={chapters}
          verses={verses}
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
