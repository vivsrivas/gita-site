export default function VerseCard({ verse, commentaries = [] }) {
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
        <section className="commentaries">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Commentaries:
          </h3>
          {commentaries.map((c) => (
            <blockquote
              key={c.author}
              className="border-l-4 border-gita-400 pl-3 mb-4"
            >
              <p className="font-medium text-gray-900 mb-4">{c.author} <span className="text-gray-400">[ {c.book} ]</span></p>
              <p className="text-medium text-gray-700 whitespace-pre-line mb-4">
                {c.commentary}
              </p>
              <p>
                {c.translation}
              </p>
            </blockquote>
          ))}
        </section>
      )}
    </div>
  );
}
