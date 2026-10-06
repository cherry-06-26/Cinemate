export const MOODS = [
  { key: "happy", label: "Feel-good", emoji: "😄", genres: "35|10751|16" },
  { key: "adrenaline", label: "Adrenaline", emoji: "💥", genres: "28|12" },
  { key: "tense", label: "Edge of seat", emoji: "😰", genres: "53|9648|80" },
  { key: "mind", label: "Mind-bending", emoji: "🌀", genres: "878|9648" },
  { key: "romantic", label: "Romantic", emoji: "💘", genres: "10749|18" },
  { key: "spooky", label: "Spooky", emoji: "👻", genres: "27|53" },
  { key: "epic", label: "Epic & magical", emoji: "🐉", genres: "14|12" },
  { key: "real", label: "Based on real life", emoji: "📜", genres: "36|99|18" },
];

export default function MoodPicker({ active, onPick }) {
  return (
    <div className="mood">
      <h2>How are you feeling?</h2>
      <div className="mood__chips" role="list">
        {MOODS.map((m) => (
          <button
            key={m.key}
            role="listitem"
            className={`chip ${active === m.key ? "chip--on" : ""}`}
            onClick={() => onPick(m.key)}
          >
            <span>{m.emoji}</span> {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}