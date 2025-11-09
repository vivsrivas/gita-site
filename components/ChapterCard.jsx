import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadCommentaries } from "../lib/loadCommentaries";

const base =
  process.env.DATA_BASE ||
  process.env.NEXT_PUBLIC_DATA_BASE ||
  "https://vivsrivas.github.io/gita-data";

const authors = (
  process.env.COMMENTARY_AUTHORS ||
  process.env.NEXT_PUBLIC_COMMENTARY_AUTHORS ||
  ""
)
  .split(",")
  .map((a) => a.trim())
  .filter(Boolean);

export default function ChapterCard({ chapter }) {
  const [commentaries, setCommentaries] = useState([]);

  useEffect(() => {
    if (!chapter?.number) return;
    loadCommentaries({
      type: "chapter",
      id: chapter.id,
      authors,
      base,
    }).then(setCommentaries);
  }, [chapter?.id]);

    return (
    <div className="chapter-card max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      {/* 🔹 Chapter Header */}
      <h2 className="text-2xl font-bold text-[#c77d28] mb-2 text-center">
        {chapter.id}. {chapter.title}
      </h2>

      {chapter.subtitle && (
        <p className="italic text-gray-600 text-center mb-6">
          {chapter.subtitle}
        </p>
      )}

      {/* 🔹 Summary */}
      {chapter.summary && (
        <p className="mb-6 text-gray-800 leading-relaxed whitespace-pre-line text-justify">
          {chapter.summary}
        </p>
      )}

      {/* 🔹 Translation */}
      {chapter.translation && (
        <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-700 mb-6">
          “{chapter.translation}”
        </blockquote>
      )}

      {/* 🔹 Internal commentary (if exists in chapter JSON) */}
      {chapter.commentary && (
        <section className="commentaries mb-6">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Commentaries:
          </h3>
          {Object.entries(chapter.commentary).map(([author, text]) => (
            <blockquote key={author} className="border-l-4 border-blue-400 pl-4 mb-4">
              <p className="font-semibold text-gray-900 mb-2">{author}</p>
              <p className="text-gray-800 text-sm">{text}</p>
            </blockquote>
          ))}
        </section>
      )}

      {/* 🔹 External Markdown commentaries */}
      {commentaries?.length > 0 && (
        <section className="commentaries mt-8">
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

              <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
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
    </div>
  );
}
