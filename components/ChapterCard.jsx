import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ChevronRight } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/gita-site";
export default function ChapterCard({ chapter, verses = [], commentaries = [], onNext }) {
  if (!chapter) return null;

  return (
    <div className="chapter-card w-full">
      {/* 🔹 Header Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Chapter number and title */}
        <h2 className="text-xl font-semibold text-gray-800">
          {chapter.id !== 0 && `${chapter.id}. `}{chapter.title}
        </h2>

        {/* Right: Next button (→ to first verse) */}
        {onNext && (
          <button
            onClick={onNext}
            title="Next"
            className="w-9 h-9 flex items-center justify-center bg-gita-500 text-white rounded-full hover:bg-gita-600 transition"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* 🔹 Sanskrit name or subtitle (if present) */}
      {chapter.subtitle && (
        <p className="italic text-gray-600 mb-4">{chapter.subtitle}</p>
      )}

      {/* 🔹 Summary */}
      {chapter.summary && (
        <div className="mb-8 text-gray-800 leading-relaxed whitespace-pre-line">
          {chapter.summary}
        </div>
      )}

      {/* 🔹 Commentaries */}
      {commentaries?.length > 0 && (
        <section className="commentaries">
          <h3 className="text-md font-semibold mb-3 text-gray-700">
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

              <div className="prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {c.commentary || ""}
                </ReactMarkdown>
              </div>
              <hr className="my-3" />
              {c.translation && (
                <div className="mt-3 text-sm text-gray-700 prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {c.translation}
                  </ReactMarkdown>
                </div>
              )}
            </blockquote>
          ))}
        </section>
      )}

      {/* 🔹 List of Verses */}
      {verses.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Verses:
          </h3>
          <div className="flex flex-wrap gap-2">
            {verses.map((v) => (
              <a
                key={`${v.chapter}.${v.verse}`}
                href={`${basePath}/verse/${v.chapter}.${v.verse}`}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-400 text-sm font-medium text-gray-800 transition"
              >
                {v.chapter}.{v.verse}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
