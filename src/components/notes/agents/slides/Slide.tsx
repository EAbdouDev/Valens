"use client";
import useNote from "@/zuztand/notesState";
import { useState } from "react";
import { generateslides } from "../actions";

export default function Slides() {
  const { text } = useNote();

  const generateHtml = async () => {
    console.log("start");
    const res = await generateslides(text);
    if (res.htmlSlides) {
      console.log(res.htmlSlides);
      setHtml(res.htmlSlides);
    }

    console.log("end");
  };

  const [html, setHtml] = useState(
    `<h1>Slide 1</h1><p>This is the content of slide 1.</p><hr><h1>Slide 2</h1><p>This is the content of slide 2.</p>`
  );
  const [title, setTitle] = useState("Presentation");

  const handleExportPPTX = async () => {
    const response = await fetch("/api/export-ppt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, title, userId: "exampleUserId" }), // Replace 'exampleUserId' with the actual user ID
    });
    const data = await response.json();
    const link = document.createElement("a");
    link.href = data.url;
    link.download = `${title}.pptx`;
    link.click();
  };

  return (
    <div>
      <h1>HTML to PPTX</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter presentation title"
      />
      <textarea value={html} onChange={(e) => setHtml(e.target.value)} />
      <button onClick={generateHtml}>generate </button>
      <button onClick={handleExportPPTX}>Export to PPTX</button>
    </div>
  );
}
