import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import Link from "next/link";


export default function Sidebar({ chapters = [], verses = [], open, setOpen }) {
  const [expanded, setExpanded] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const activeVerseRef = useRef(null);
  const router = useRouter();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/gita-site";

  // ✅ Enable client-only features
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("expandedChapter");
      if (saved) setExpanded(Number(saved));
    }
  }, []);

  // ✅ Determine current page (chapter or verse)
  useEffect(() => {
    if (!isClient || !router.asPath) return;

    const verseMatch = router.asPath.match(/\/verse\/(\d+\.\d+)/);
    const chapterMatch = router.asPath.match(/\/\?chapter=(\d+)/);

    if (verseMatch) {
      const id = verseMatch[1];
      setActiveId(id);
      const currentChapter = parseInt(id.split(".")[0]);
      setExpanded(currentChapter);
      localStorage.setItem("expandedChapter", currentChapter);
    } else if (chapterMatch) {
      const currentChapter = parseInt(chapterMatch[1]);
      setExpanded(currentChapter);
      setActiveId(`chapter-${currentChapter}`);
      localStorage.setItem("expandedChapter", currentChapter);
    } else {
      const saved = localStorage.getItem("expandedChapter");
      setExpanded(saved ? Number(saved) : null);
    }
  }, [router.asPath, isClient]);

  // ✅ Prevent unwanted scrolls when navigating via Next/Prev
  useEffect(() => {
    if (window.__skipSidebarScroll) {
      window.__skipSidebarScroll = false;
      return;
    }
    if (activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeId]);

  // ✅ Expand/collapse a chapter
  const toggleExpand = (num) => {
    setExpanded((prev) => {
      const newVal = prev === num ? null : num;
      if (typeof window !== "undefined") {
        if (newVal) localStorage.setItem("expandedChapter", newVal);
        else localStorage.removeItem("expandedChapter");
      }
      return newVal;
    });
  };

  // ✅ Build a verse lookup by chapter (optional)
  const versesByChapter = verses.reduce((acc, v) => {
    const cnum = parseInt(v.chapter);
    if (!acc[cnum]) acc[cnum] = [];
    acc[cnum].push(v);
    acc[cnum].sort((a, b) => a.verse - b.verse);
    return acc;
  }, {});

  return (
    <>
      <aside
        className={`fixed sm:static inset-y-0 overflow-y-auto left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="p-4 h-full">
          {/* 🔹 Mobile Header */}
          <div className="flex items-center justify-between mb-4 sm:hidden">
            <h2 className="text-lg font-semibold text-gray-700">Chapters</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* 🔹 Chapter list */}
          {chapters.length === 0 ? (
            <p className="text-sm text-gray-500">Loading chapters...</p>
          ) : (
            <ul className="space-y-2">
              {chapters.map((chapter, index) => {
                const num = Number(chapter.id || index );
                const isOpen = expanded === num;
                const isActiveChapter =
                  activeId === `chapter-${num}` ||
                  (activeId && Number(activeId.split(".")[0]) === num);

                const verseList =
                  versesByChapter[num] || chapter.verses || [];

                return (
                  <li key={num}>
                    {/* Chapter button */}
                    <button
                      onClick={() => toggleExpand(num)}
                      className={`flex items-center justify-between w-full p-2 transition font-medium ${
                        isActiveChapter
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <span>
                        {num}. {chapter.title || `Chapter ${num}`}
                      </span>
                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {/* Verses list */}
                    {isOpen && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                        <li>
                          <Link
                            href={`/chapter/${num}`}
                            onClick={() => setOpen(false)}
                            className={`block p-1 text-sm transition ${
                              activeId === `chapter-${num}`
                                ? "bg-blue-100 text-blue-800 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Overview
                          </Link>
                        </li>
                        {verseList.map((v, i) => {
                          const vid =
                            typeof v === "string"
                              ? v
                              : `${v.chapter}.${v.verse}`;
                          const isActiveVerse = activeId === vid;

                          return (
                            <li key={vid || i} ref={isActiveVerse ? activeVerseRef : null}>
                              <Link
                                href={`/verse/${vid}`}
                                onClick={() => {
                                  window.__skipSidebarScroll = true;
                                  setOpen(false);
                                }}
                                className={`block p-1 text-sm transition ${
                                  isActiveVerse
                                    ? "bg-blue-100 text-blue-800 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                Verse {vid}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* 🔹 Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 sm:hidden z-30"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
