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

        const getChapterId = (item) => {
          if (!item) return null;
          const raw = item.id ?? item.number ?? null;
          const num = Number(raw);
          return Number.isFinite(num) ? num : null;
        };

        const chapterIndex = chaptersData.findIndex(
          (c) => Number(c.id) === Number(chapter) || Number(c.number) === Number(chapter)
        );
        if (chapterIndex !== -1) {
          const prev = chaptersData[chapterIndex - 1] || null;
          const next = chaptersData[chapterIndex + 1] || null;
          const prevId = getChapterId(prev);
          const nextId = getChapterId(next);
          setPrevChapter(prevId && prevId > 0 ? { id: prevId, title: prev?.title ?? null } : null);
          setNextChapter(nextId !== null ? { id: nextId, title: next?.title ?? null } : null);
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

          {(() => {
            const hasPrev = prevChapter !== null;
            const hasNext = nextChapter !== null;
            if (!hasPrev && !hasNext) return null;

            const makeLabel = (entry) => {
              if (!entry) return "";
              const num = entry.id;
              const title = entry.title;
              return `Chapter ${num}`;
            };

            const containerClasses =
              hasPrev && hasNext ? "justify-between" : "justify-start";

            return (
              <div className={`flex gap-4 mt-6 ${containerClasses}`}>
                {hasPrev && (
                  <Link
                    href={`/chapter/${prevChapter.id}`}
                    onClick={() => {
                      window.__skipSidebarScroll = true;
                      setSidebarOpen(false);
                    }}
                    className="inline-block px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-500 transition"
                  >
                    ← {makeLabel(prevChapter)}
                  </Link>
                )}

                {hasNext && (
                  <Link
                    href={`/chapter/${nextChapter.id}`}
                    onClick={() => {
                      window.__skipSidebarScroll = true;
                      setSidebarOpen(false);
                    }}
                    className="inline-block px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-500 transition"
                  >
                    {makeLabel(nextChapter)} →
                  </Link>
                )}
              </div>
            );
          })()}

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
