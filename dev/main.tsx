import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { SimpleTextEditor } from "../src";

function App() {
  const [content, setContent] = useState("");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Simple Text Editor Development</h1>
      <SimpleTextEditor content={content} onContentUpdate={setContent} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
