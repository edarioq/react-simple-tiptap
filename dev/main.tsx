import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ReactSimpleTiptap } from "../src";

function App() {
  const [content, setContent] = useState("");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>React Simple Tiptap Development</h1>
      <ReactSimpleTiptap content={content} onContentUpdate={setContent} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
