import React, { useState } from "react";

const BACKEND_URL = "https://humanbd.onrender.com"; // Replace with your backend

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

      const data = await res.json();
      setOutputText(data.humanisedText || "Error: No output");
      setHistory([{ input: inputText, output: data.humanisedText }, ...history]);
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
    <div className="container">
      <h1>Text Humaniser</h1>
      <textarea
        placeholder="Paste your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={6}
      />
      <button onClick={handleHumanise} disabled={loading}>
        {loading ? "Humanising..." : "Humanise"}
      </button>

      {outputText && (
        <div className="output">
          <h2>Humanised Text</h2>
          <pre>{outputText}</pre>
          <button onClick={handleCopy}>Copy</button>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h2>History</h2>
          {history.map((item, idx) => (
            <div key={idx} className="history-item">
              <strong>Input:</strong>
              <pre>{item.input}</pre>
              <strong>Output:</strong>
              <pre>{item.output}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
