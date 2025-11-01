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
  // 🔹 Attempt to load multiple commentaries
  const commentaryAuthors = ["shankara", "ramanuja", "madhva", "jayateertha", "raghevendra"]; // add more later if needed
  const commentaries = [];

  for (const author of commentaryAuthors) {
    try {
      const res = await fetch(`${base}/commentaries/${author}/${id}.json`);
      if (res.ok) {
        const data = await res.json();
        commentaries.push({ author, ...data });
      }
    } catch (err) {
      console.warn(`No commentary found for ${author}/${id}`);
    }
  }

  return {
    props: { verse, chapters, commentaries },
  };
}

export default function VersePage({ verse: initialVerse, chapters: initialChapters, commentaries: initialCommentaries }) {
  const router = useRouter();
  const { id } = router.query;        // e.g. "1.1"

  const [verse, setVerse] = useState(null);
  const [chapters, setChapters] = useState(initialChapters);
  const [commentaries, setCommentaries] = useState(initialCommentaries);

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
    const commentaryAuthors = ["shankara", "ramanuja", "madhva", "jayateertha", "raghevendra"]; // add more later if needed
    Promise.all(
      commentaryAuthors.map(async (author) => {
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
    ).then((results) => setCommentaries(results.filter(Boolean)));

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

        <a href={`${basePath}/`} className="back-link">
          ⟵ Back to Chapters
        </a>
      </div>
    </main>
  );
}
