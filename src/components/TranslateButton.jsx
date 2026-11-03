export default function TranslateButton({ handleTranslate, loading }) {
  return (
    <div className="footer-row">
      <button
        className={`translate-btn${loading ? " loading" : ""}`}
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? "Translating…" : "Translate"}
      </button>
    </div>
  );
}