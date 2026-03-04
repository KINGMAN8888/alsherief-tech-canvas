/**
 * Splits `text` by the given cyan/violet keywords and wraps each match
 * in a colored <span>. Used in both AdminProfile preview and Hero.tsx.
 */
export function renderColoredText(text: string, cyanWord?: string, violetWord?: string) {
  const markers: Array<{ word: string; color: "cyan" | "violet" }> = [];
  if (cyanWord?.trim()) markers.push({ word: cyanWord.trim(), color: "cyan" });
  if (violetWord?.trim()) markers.push({ word: violetWord.trim(), color: "violet" });
  if (markers.length === 0) return text;

  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${markers.map(m => escape(m.word)).join("|")})`, "gi");
  const segments = text.split(regex);

  return segments.map((seg, i) => {
    if (cyanWord && seg.toLowerCase() === cyanWord.trim().toLowerCase())
      return <span key={i} className="text-cyan-400 font-semibold">{seg}</span>;
    if (violetWord && seg.toLowerCase() === violetWord.trim().toLowerCase())
      return <span key={i} className="text-violet-400 font-semibold">{seg}</span>;
    return <span key={i}>{seg}</span>;
  });
}
