import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import ChapterCard from "../../components/ChapterCard";

const base = process.env.NEXT_PUBLIC_DATA_BASE || "https://vivsrivas.github.io/gita-data";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/gita-site";

export default function ChapterPage() {
  const router = useRouter();
  const { chapter } = router.query;

  const [chapterInfo, setChapterInfo] = useState(null);
  const [verses, setVerses] = useState([]);

  useEffect(() => {
    if (!chapter) return;

    // Load chapters metadata
    fetch(`${base}/chapters.json`)
      .then((res) => res.json())
      .then((chapters) => {
        const ch = chapters.find((c) => c.number === Number(chapter));
        setChapterInfo(ch);
      })
      .catch((err) => console.error("Error loading chapters:", err));

    // Load all verses for this chapter
    fetch(`${base}/index.json`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((v) => v.chapter === Number(chapter));
        setVerses(filtered);
      })
      .catch((err) => console.error("Error loading verses:", err));
  }, [chapter]);

  if (!chapterInfo) return <p>Loading...</p>;

  return (
    <main className="layout">
      <Sidebar />
      <div className="content p-4 sm:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Chapter {chapterInfo.id}: {chapterInfo.title}
        </h2>
        <p className="text-gray-600 mb-6">{chapterInfo.summary}</p>

        <ul className="space-y-3">
          {verses.map((v) => (
            <li key={`${v.chapter}.${v.verse}`}>
              <a
                href={`${basePath}/verse/${v.chapter}.${v.verse}`}
                className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-800">
                  Verse {v.chapter}.{v.verse}
                </span>
                <p className="text-sm text-gray-600 truncate">
                  {v.translation || v.text_sanskrit?.slice(0, 80)}…
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
