export default function VerseCard({ verse, commentaries }) {
  return (
    <div className="verse-card">
      <h2>{verse.chapter}.{verse.verse_number}</h2>
      <p className="sanskrit">{verse.text_sanskrit}</p>
      <p><strong>Translation:</strong> {verse.translation}</p>

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
        <section className="mt-6 border-t pt-3">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Additional Commentaries
          </h3>
          {commentaries.map((c) => (
            <blockquote
              key={c.author}
              className="border-l-4 border-blue-400 pl-3 mb-4"
            >
              <p className="font-medium text-gray-900">{c.author}</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {c.commentary}
              </p>
            </blockquote>
          ))}
        </section>
      )}
    </div>
  );
}
