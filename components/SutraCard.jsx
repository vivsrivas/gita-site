export default function SutraCard({ sutra }) {
  return (
    <div className="sutra-card">
      <h2>{sutra.id}: {sutra.text}</h2>
      <p><strong>Translation:</strong> {sutra.translation}</p>
      <blockquote>{sutra.commentary}</blockquote>
    </div>
  );
}
