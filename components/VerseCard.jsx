export default function VerseCard({ verse }) {
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
    </div>
  );
}
