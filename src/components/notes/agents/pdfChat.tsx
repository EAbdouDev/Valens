"use client";
import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";
import pdfParse from "pdf-parse";

interface PdfChatProps {}

const PdfChat: FC<PdfChatProps> = ({}) => {
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfInfo, setPdfInfo] = useState<any>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer);

      setPdfText(data.text);
      setPdfInfo({
        numpages: data.numpages,
        numrender: data.numrender,
        info: data.info,
        metadata: data.metadata,
        version: data.version,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className=" p-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 rounded p-4 text-center"
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop a PDF file here, or click to select one</p>
      </div>
      {pdfText && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-bold mb-2">Extracted Text</h2>
          <p>{pdfText}</p>
        </div>
      )}
      {pdfInfo && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-bold mb-2">PDF Info</h2>
          <p>Number of Pages: {pdfInfo.numpages}</p>
          <p>Number of Rendered Pages: {pdfInfo.numrender}</p>
          <p>PDF Info: {JSON.stringify(pdfInfo.info)}</p>
          <p>PDF Metadata: {JSON.stringify(pdfInfo.metadata)}</p>
          <p>PDF.js Version: {pdfInfo.version}</p>
        </div>
      )}
    </div>
  );
};

export default PdfChat;
