const languages = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "C#"];

export default function LanguageSelector({ sourceLanguage, targetLanguage, setSourceLanguage, setTargetLanguage, onSwap }) {
  return (
    <div className="lang-row">
      <div className="lang-select-wrap">
        <select value={sourceLanguage} onChange={e => setSourceLanguage(e.target.value)}>
          {languages.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <button className="swap-btn" onClick={onSwap}>⇄</button>

      <div className="lang-select-wrap">
        <select value={targetLanguage} onChange={e => setTargetLanguage(e.target.value)}>
          {languages.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}