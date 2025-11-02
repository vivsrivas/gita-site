import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function VerseCard({ verse, commentaries = [] }) {
  return (
    <div className="verse-card">
      <h2>{verse.chapter}.{verse.verse_number}</h2>
      <p className="sanskrit mb-6 font-semibold whitespace-pre-line leading-relaxed">
        {verse.text_sanskrit
          .split("।")
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
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
