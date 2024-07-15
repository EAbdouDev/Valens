"use client";

import React, { useState } from "react";
import pdf from "pdf-parse";
import { Buffer } from "buffer";

const UploadPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);

        const extractedText = await pdf(buffer);
        setText(extractedText.text);
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      {text && (
        <div className="mt-4">
          <h3>Extracted Text:</h3>
          <textarea
            value={text}
            readOnly
            className="w-full h-64 p-2 border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
