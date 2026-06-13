import { useState } from "react";
import { translateCode } from "../translator/translator";
import LanguageSelector from "../components/LanguageSelector";
import CodeInput from "../components/CodeInput";
import CodeOutput from "../components/CodeOutput";
import TranslateButton from "../components/TranslateButton";

export default function TranslatorPage() {
  const [sourceLanguage, setSourceLanguage] = useState("Java");
  const [targetLanguage, setTargetLanguage] = useState("Python");
  const [code, setCode]                     = useState("");
  const [translatedCode, setTranslatedCode] = useState("");
  const [status, setStatus]                 = useState("Ready");

  const handleTranslate = () => {
    if (!code.trim()) { setStatus("Paste some code first"); return; }
    try {
      const result = translateCode(code, targetLanguage);
      setTranslatedCode(result);
      setStatus(`Done · Java → ${targetLanguage}`);
    } catch {
      setStatus("Translation failed.");
    }
  };

  const handleSwap = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setTranslatedCode("");
    setStatus("Ready");
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Code Translator</h1>
        <p className="page-sub">Translate Java code to any language instantly</p>
      </div>
      <LanguageSelector
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        setSourceLanguage={setSourceLanguage}
        setTargetLanguage={setTargetLanguage}
        onSwap={handleSwap}
      />
      <div className="editors">
        <CodeInput code={code} setCode={setCode} />
        <CodeOutput translatedCode={translatedCode} />
      </div>
      <TranslateButton handleTranslate={handleTranslate} loading={false} />
      <div className="status-bar">
        <span className="status-dot"></span>
        <span>{status}</span>
      </div>
    </div>
  );
}