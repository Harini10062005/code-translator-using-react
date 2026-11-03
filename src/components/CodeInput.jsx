export default function CodeInput({ code, setCode }) {
  const handlePaste = async () => {
    try { setCode(await navigator.clipboard.readText()); } catch {}
  };

  return (
    <div className="editor-panel">
      <div className="panel-header">
        <span className="panel-label">Source</span>
        <div className="panel-actions">
          <button className="panel-btn" onClick={() => setCode("")} title="Clear">✕</button>
          <button className="panel-btn" onClick={handlePaste} title="Paste">⎘</button>
        </div>
      </div>
      <textarea
        className="code-area"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={`// Paste or type your Java code here...\n// Example:\nSystem.out.println("Hello World");`}
        spellCheck={false}
      />
    </div>
  );
}