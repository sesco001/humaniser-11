import React, { useState } from "react";

const BACKEND_URL = "https://humanbd.onrender.com/"; // Use the exact endpoint

export default function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleHumanise = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      const humanised = data.humanisedText || "Error: No output";

      setOutputText(humanised);
      setHistory((prev) => [{ input: inputText, output: humanised }, ...prev]);
      setInputText("");
    } catch (err) {
      setOutputText("Error contacting API");
      console.error(err);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container" style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h1>Text Humaniser</h1>
      <textarea
        placeholder="Paste your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleHumanise} disabled={loading} style={{ marginBottom: 20 }}>
        {loading ? "Humanising..." : "Humanise"}
      </button>

      {outputText && (
        <div className="output" style={{ marginBottom: 20 }}>
          <h2>Humanised Text</h2>
          <pre style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: 10 }}>
            {outputText}
          </pre>
          <button onClick={handleCopy}>Copy</button>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h2>History</h2>
          {history.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 10, borderBottom: "1px solid #ddd", paddingBottom: 5 }}>
              <strong>Input:</strong>
              <pre style={{ whiteSpace: "pre-wrap" }}>{item.input}</pre>
              <strong>Output:</strong>
              <pre style={{ whiteSpace: "pre-wrap" }}>{item.output}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

