import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";

export default function VerseCard({ verse, commentaries = [], 
  onPrev, 
  onNext,
  onPrevChapter,
  onNextChapter }) {
  return (
    <div className="verse-card">
      {/* 🔹 Header Row: verse number + next button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {verse.chapter}.{verse.verse_number}
        </h2>
        {/* Right: Navigation buttons */}
        <div className="flex items-center gap-2">
          {onPrevChapter && (
            <button
              onClick={onPrevChapter}
              className="w-9 h-9 flex items-center justify-center bg-gita-500 text-white rounded-full hover:bg-gita-500 transition"
              title="Previous Chapter"
            >
              <SkipBack size={18} />
            </button>
          )}
          {onPrev && (
            <button
              onClick={onPrev}
              className="w-9 h-9 flex items-center justify-center bg-gita-500 text-white rounded-full hover:bg-gita-500 transition"
              title="Previous Verse"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="w-9 h-9 flex items-center justify-center bg-gita-500 text-white rounded-full hover:bg-gita-600 transition"
              title="Next Verse"
            >
              <ChevronRight size={18} />
            </button>
          )}
          {onNextChapter && (
            <button
              onClick={onNextChapter}
              className="w-9 h-9 flex items-center justify-center bg-gita-500 text-white rounded-full hover:bg-gita-600 transition"
              title="Next Chapter"
            >
              <SkipForward size={18} />
            </button>
          )}
        </div>
      </div>
      <p className="sanskrit mb-6 font-semibold whitespace-pre-line leading-relaxed">
        {verse.text_sanskrit
          .replace(/<br\s*\/?>/gi, "\n") // turn HTML <br> into actual newlines
          .split(/।|\n/) // split on danda OR newline
          .filter(Boolean)
          .map((part, idx) => (
            <span key={idx}>
              {part.trim()}।
              <br />
            </span>
          ))}
      </p>
      <p className="mb-6">{verse.translation}</p>

      {verse.commentary && (
        <div className="commentaries">
          {Object.entries(verse.commentary).map(([author, text]) => (
            <blockquote key={author}>
              <strong>{author}:</strong> {text}
            </blockquote>
          ))}
        </div>
      )}
      {/* 🔹 External commentaries (new structure) */}
      {commentaries?.length > 0 && (
        <section className="commentaries">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Commentaries:
          </h3>
            {commentaries.map((c) => (
              <blockquote
                key={c.author}
                className="border-l-4 border-blue-400 pl-4 mb-6"
              >
                <p className="font-semibold text-gray-900 mb-2">
                  {c.author}{" "}
                  {c.book && (
                    <span className="text-gray-600 text-sm">[ {c.book} ]</span>
                  )}
                </p>

                {/* ✅ Updated Markdown rendering */}
                <div className="prose prose-sm max-w-none text-gray-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {c.commentary || ""}
                  </ReactMarkdown>
                </div>

                {c.translation && (
                  <p className="mt-3 text-sm text-gray-700">
                    “{c.translation}”
                  </p>
                )}
              </blockquote>
            ))}
        </section>
      )}
    </div>
  );
}
