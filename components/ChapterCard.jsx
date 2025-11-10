import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/gita-site";
export default function ChapterCard({ chapter, verses = [], commentaries = [] }) {
  if (!chapter) return null;

  return (
    <div className="chapter-card w-full">
      {/* 🔹 Chapter Heading */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Chapter {chapter.id || chapter.number}:{" "}
        <span className="text-[#c77d28]">{chapter.title}</span>
      </h2>

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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {c.commentary || ""}
                </ReactMarkdown>
              </div>

              {c.translation && (
                <p className="mt-3 text-sm text-gray-700 italic">
                  “{c.translation}”
                </p>
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
