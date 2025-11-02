import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Search } from "lucide-react";
import SearchBox from "../components/SearchBox";

const base =
  process.env.DATA_BASE ||  // visible to Node during build & dev
  process.env.NEXT_PUBLIC_DATA_BASE || 
  "https://vivsrivas.github.io/gita-data";
  
export default function Home() {
  const [verses, setVerses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
     // Load chapters
    fetch(`${base}/chapters.json`)
      .then((res) => res.json())
      .then((data) => setChapters(data))
      .catch((err) => console.error("Error loading chapters:", err));

    // Load from public/data/index.json (prebuilt search index)
    fetch(`${base}/index.json`)
      .then((res) => res.json())
      .then((data) => setVerses(data))
      .catch((err) => console.error("Error loading verses:", err));
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
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
