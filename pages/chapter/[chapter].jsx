import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import ChapterCard from "../../components/ChapterCard";
import Header from "../../components/Header";
import { loadCommentaries } from "../../lib/loadCommentaries";

const base =
  process.env.DATA_BASE ||
  process.env.NEXT_PUBLIC_DATA_BASE ||
  "https://vivsrivas.github.io/gita-data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/gita-site";

const authors = (
  process.env.NEXT_PUBLIC_COMMENTARY_AUTHORS ||
  process.env.COMMENTARY_AUTHORS ||
  ""
)
  .split(",")
  .map((a) => a.trim())
  .filter(Boolean);

export default function ChapterPage() {
  const router = useRouter();
  const { chapter } = router.query;

  const [chapterInfo, setChapterInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [commentaries, setCommentaries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!chapter) return;

    const loadData = async () => {
      try {
        // 🔹 Load chapters
        const chaptersRes = await fetch(`${base}/chapters.json`);
        const chaptersData = await chaptersRes.json();
        setChapters(chaptersData);

        // Match chapter by `id` or `number`
        const ch = chaptersData.find(
          (c) => Number(c.id) === Number(chapter) || Number(c.number) === Number(chapter)
        );
        setChapterInfo(ch);

        // 🔹 Load all verses
        const versesRes = await fetch(`${base}/index.json`);
        const versesData = await versesRes.json();
        setVerses(versesData);

        // 🔹 Load commentaries (if available)
        const comms = await loadCommentaries({
          base,
          authors,
          type: "chapters",
          id: chapter,
        });
        setCommentaries(comms);
      } catch (err) {
        console.error("⚠️ Error loading chapter:", err);
      }
    };

    loadData();
  }, [chapter]);

  if (!chapterInfo)
    return (
      <main className="flex min-h-screen items-center justify-center text-gray-600">
        Loading chapter...
      </main>
    );

  return (
    <main className="flex flex-col min-h-screen">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 pt-[64px]">
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          chapters={chapters}
          verses={verses}
        />

        <div className="flex-1 p-6 overflow-y-auto">
          <ChapterCard
            chapter={chapterInfo}
            verses={verses.filter(
              (v) => Number(v.chapter) === Number(chapter)
            )}
            commentaries={commentaries}
          />

          <a
            href={`${basePath}/`}
            className="block text-center text-blue-700 mt-6 hover:underline"
          >
            ⟵ Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
