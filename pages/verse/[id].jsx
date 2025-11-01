import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import VerseCard from "../../components/VerseCard";

const base = process.env.NEXT_PUBLIC_DATA_BASE || "https://vivsrivas.github.io/gita-data";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "gita-site";

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

  const resVerse = await fetch(`${base}/verses/${id}.json`);
  const verse = await resVerse.json();

  const resChapters = await fetch(`${base}/chapters.json`);
  const chapters = await resChapters.json();

  return {
    props: { verse, chapters },
  };
}

export default function VersePage() {
  const router = useRouter();
  const { id } = router.query;        // e.g. "1.1"

  const [verse, setVerse] = useState(null);
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
  const goToVerse = (newId) => {
    router.push(`/verse/${newId}`, undefined, { shallow: true });
  };

  if (!verse) return <p>Loading...</p>;

  return (
    <main className="layout">
      <Sidebar />
      <div className="content">
        <VerseCard verse={verse} />

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

        <a href={`${basePath}/`} className="back-link">
          ⟵ Back to Chapters
        </a>
      </div>
    </main>
  );
}
