const TOKEN_REPLACEMENTS = [
  ["R^I", "ṝ"],
  ["R^i", "ṛ"],
  ["L^I", "ḹ"],
  ["L^i", "ḷ"],
  ["j~n", "jñ"],
  ["~N", "ṅ"],
  ["~n", "ñ"],
  ["Th", "ṭh"],
  ["Dh", "ḍh"],
  ["Sh", "ṣ"],
  ["sh", "ś"],
  ["Ch", "ch"],
  ["T", "ṭ"],
  ["D", "ḍ"],
  ["N", "ṇ"],
  ["S", "ṣ"],
  ["A", "ā"],
  ["I", "ī"],
  ["U", "ū"],
  ["M", "ṁ"],
  ["H", "ḥ"],
];

export function itransToIast(text = "") {
  if (!text) return "";

  let result = text.trim();

  result = result
    .replace(/\.a/g, "'")
    .replace(/\.n/g, "ṁ")
    .replace(/\.m/g, "ṁ");

  for (const [source, target] of TOKEN_REPLACEMENTS) {
    result = result.replaceAll(source, target);
  }

  return result
    .replace(/\s*\.\.\s*(\d+-\d+)\s*\.\./g, " || $1 ||")
    .replace(/\s*\.\.\s*/g, " || ")
    .replace(/\s*\.\s*/g, " | ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatIastForDisplay(itransText = "") {
  const raw = itransToIast(itransText);
  if (!raw) return "";

  const protectedDoubleBars = raw.replace(/\|\|/g, "__DOUBLE_BAR__");

  return protectedDoubleBars
    .replace(/\|/g, "|\n")
    .replace(/__DOUBLE_BAR__/g, "||")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
