import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

export default function Sidebar({ chapters = [], onSelect, open, setOpen }) {
  const [expanded, setExpanded] = useState(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/gita-site";

  const toggleExpand = (chapterNumber) => {
    setExpanded(expanded === chapterNumber ? null : chapterNumber);
  };

  return (
    <>
      {/* 🔹 Sidebar (collapsible on mobile) */}
      <aside
        className={`fixed sm:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >
        <div className="p-4 h-full overflow-y-auto">
          {/* 🔹 Header for sidebar */}
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
              {chapters.map((chapter) => (
                <li key={chapter.number}>
                  <button
                    onClick={() => toggleExpand(chapter.number)}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 transition text-gray-800 font-medium"
                  >
                    <span>
                      {chapter.number}. {chapter.title}
                    </span>
                    {expanded === chapter.number ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {/* 🔹 Verses under expanded chapter */}
                  {expanded === chapter.number && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                      {chapter.verses?.map((verseId) => (
                        <li key={verseId}>
                          <a
                            href={`${basePath}/verse/${verseId}`}
                            onClick={() => setOpen(false)}
                            className="block p-1 rounded hover:bg-gray-50 text-sm text-gray-700"
                          >
                            Verse {verseId}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* 🔹 Overlay (for mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 sm:hidden z-30"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
