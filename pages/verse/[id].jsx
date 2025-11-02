import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import VerseCard from "../../components/VerseCard";
import Header from "../../components/Header";

const base =
  process.env.DATA_BASE ||  // visible to Node during build & dev
  process.env.NEXT_PUBLIC_DATA_BASE || 
  "https://vivsrivas.github.io/gita-data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "gita-site";
export const authors = (
  process.env.COMMENTARY_AUTHORS ||
  process.env.NEXT_PUBLIC_COMMENTARY_AUTHORS ||
  ""
)
  .split(",")
  .map((a) => a.trim())
  .filter(Boolean);
/**
 * Tell Next.js which verse pages to pre-render at build time
 */
export async function getStaticPaths() {
  const res = await fetch(`${base}/index.json`);
  const verses = await res.json();

  const paths = verses.map((v) => ({
    params: { id: `${v.chapter}.${v.verse}` },
  }));

  return { paths, fallback: false };
}

/**
 * For each verse page, fetch its JSON data from gita-data
 */
export async function getStaticProps({ params }) {
  const { id } = params;
  const [chapter, verseNum] = id.split(".");

  const safeFetchJSON = async (url, label) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`⚠️ ${label} not found (${res.status}): ${url}`);
        return null;
      }

      const text = await res.text();
      if (text.trim().startsWith("<")) {
        console.warn(`⚠️ ${label} returned HTML (not JSON): ${url}`);
        return null;
      }

      return JSON.parse(text);
    } catch (err) {
      console.warn(`⚠️ Failed to load ${label}:`, err.message);
      return null;
    }
  };

    // 🔹 Verse
  const verse = await safeFetchJSON(`${base}/verses/${id}.json`, `Verse ${id}`);
  // 🔹 Chapters (for sidebar)
  const chapters = await safeFetchJSON(`${base}/chapters.json`, "Chapters");
  // 🔹 Attempt to load multiple commentaries
  const commentaries = [];

  for (const author of authors) {
      const c = await safeFetchJSON(`${base}/commentaries/${author}/${id}.json`, `Commentary ${author}/${id}`);
      if (c) {
        commentaries.push({ author, ...c })
        console.log(`✅ Loaded commentary: ${author} for verse ${id}`);
      };
  }

  return {
    props: { verse, chapters, commentaries },
  };
}

export default function VersePage({ verse: initialVerse, chapters: initialChapters, commentaries: initialCommentaries }) {
  const router = useRouter();
  const { id } = router.query;        // e.g. "1.1"

  const [verse, setVerse] = useState(initialVerse);
  const [chapters, setChapters] = useState(initialChapters);
  const [commentaries, setCommentaries] = useState(initialCommentaries);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

  // 🔹 Load verse + navigation whenever id changes
  useEffect(() => {
    if (!id) return;
    
    // Load verse JSON
    fetch(`${base}/verses/${id}.json`)
      .then((res) => res.json())
      .then((data) => setVerse(data))
      .catch((err) => console.error("Error loading verse:", err));

    // Load commentaries dynamically (if not preloaded)
    Promise.all(
      authors.map(async (author) => {
        try {
          const res = await fetch(`${base}/commentaries/${author}/${id}.json`);
          if (res.ok) {
            const data = await res.json();
            return { author, ...data };
          }
        } catch {
          return null;
        }
      })
    ).then((results) => {
      console.log("Fetched commentaries:", results); 
      setCommentaries(results.filter(Boolean))
    });

    // Load chapters.json to compute navigation
    fetch(`${base}/chapters.json`)
      .then((res) => res.json())
      .then((chapters) => {
        const allVerses = chapters.flatMap((c) => c.verses);
        const index = allVerses.indexOf(id);
        setPrevId(index > 0 ? allVerses[index - 1] : null);
        setNextId(index < allVerses.length - 1 ? allVerses[index + 1] : null);
      })
      .catch((err) => console.error("Error loading chapters:", err));
  }, [id]);

  // 🔹 Navigation without reload
  const contentRef = useRef(null);

  const goToVerse = (newId) => {
    // tell sidebar to skip its scrollIntoView on next render
    window.__skipSidebarScroll = true;

    router.push(`/verse/${newId}`, undefined, { shallow: true }).then(() => {
      // scroll only the content area, not the window
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  if (!verse) return <p>Loading...</p>;

  return (
    <main className="layout">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 pt-[50px]"> {/* padding = header height */}
        <Sidebar chapters={chapters} 
          open={sidebarOpen}
          setOpen={setSidebarOpen} />
        <div ref={contentRef} className="content flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          <VerseCard verse={verse} commentaries={commentaries} />

          <div className="nav-buttons">
            {prevId && (
              <button
                className="nav-link prev"
                onClick={() => goToVerse(prevId)}
              >
                ← Previous
              </button>
            )}
            {nextId && (
              <button
                className="nav-link next"
                onClick={() => goToVerse(nextId)}
              >
                Next →
              </button>
            )}
          </div>

          <a href={`${basePath}/`} className="back-link block text-center mt-6">
            ⟵ Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
