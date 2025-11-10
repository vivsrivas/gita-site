import { useRouter } from "next/router";
import Link from "next/link";
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
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

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

        const chapterIndex = chaptersData.findIndex(
          (c) => Number(c.id) === Number(chapter) || Number(c.number) === Number(chapter)
        );
        if (chapterIndex !== -1) {
          const getChapterId = (item) =>
            item && (item.id ?? item.number ?? null);
          const prev = chaptersData[chapterIndex - 1] || null;
          const next = chaptersData[chapterIndex + 1] || null;
          setPrevChapter(prev ? getChapterId(prev) : null);
          setNextChapter(next ? getChapterId(next) : null);
        } else {
          setPrevChapter(null);
          setNextChapter(null);
        }

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

          <div className="flex justify-between gap-4 mt-6">
            <div>
              {prevChapter && (
                <Link
                  href={`/chapter/${prevChapter}`}
                  onClick={() => {
                    window.__skipSidebarScroll = true;
                    setSidebarOpen(false);
                  }}
                  className="inline-block px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-500 transition"
                >
                  ← Previous Chapter
                </Link>
              )}
            </div>
            <div className="ml-auto">
              {nextChapter && (
                <Link
                  href={`/chapter/${nextChapter}`}
                  onClick={() => {
                    window.__skipSidebarScroll = true;
                    setSidebarOpen(false);
                  }}
                  className="inline-block px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-500 transition"
                >
                  Next Chapter →
                </Link>
              )}
            </div>
          </div>

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
