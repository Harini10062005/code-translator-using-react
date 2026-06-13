export default function CodeOutput({ translatedCode }) {
  const handleCopy = async () => {
    if (translatedCode) await navigator.clipboard.writeText(translatedCode);
  };

  return (
    <div className="editor-panel">
      <div className="panel-header">
        <span className="panel-label">Output</span>
        <div className="panel-actions">
          <button className="panel-btn" onClick={handleCopy} title="Copy">⎘</button>
        </div>
      </div>
      <div className="output-area">
        {translatedCode || (
          <div className="output-placeholder">
            <span>Translated code will appear here</span>
          </div>
        )}
      </div>
    </div>
  );
}