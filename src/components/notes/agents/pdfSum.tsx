"use client";
import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";
//@ts-ignore
import * as pdfjsLib from "pdfjs-dist/webpack.mjs";
import { generateSummary } from "./actions";

import TextEditor from "@/components/editor/TextEditor";
import { File, Loader2, Sparkle, Sparkles, X } from "lucide-react";
import { Button } from "@nextui-org/react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

interface PdfChatProps {}

const PdfSum: FC<PdfChatProps> = ({}) => {
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfInfo, setPdfInfo] = useState<any>(null);
  const [ai, setAi] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;

      const numPages = pdfDocument.numPages;
      const pdfTextItems: string[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();

        const textItems = textContent.items.map((item: any) => item.str);
        pdfTextItems.push(textItems.join(" "));
      }

      setPdfText(pdfTextItems.join("\n"));
      setPdfInfo({
        numpages: pdfDocument.numPages,
        info: pdfDocument.info,
        metadata: pdfDocument.metadata,
        version: pdfDocument.version,
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const generate = async () => {
    setAi(null);
    if (pdfText) {
      setIsGenerating(true);
      const res = await generateSummary(pdfText);
      if (res) {
        console.log(res);
        setAi(res);
        setIsGenerating(false);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPdfText("");
    setPdfInfo(null);
    setAi(null);
  };

  return (
    <div className="px-4">
      {!ai && !uploadedFile && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            isDragActive ? "border-blue-500" : "border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop a PDF file here, or click to select one</p>
        </div>
      )}

      {uploadedFile && (
        <div className="flex w-full justify-between items-center mt-4 p-2 bg-[#e1e1e1] rounded-lg dark:bg-[#3c3c3c]">
          <div className="flex justify-start items-center gap-2 ">
            <File className="w-6 h-6 mr-2 flex-none" />
            <span className="">{uploadedFile.name}</span>
          </div>
          <button onClick={removeFile} className="">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
      {uploadedFile && pdfText && (
        <Button
          onClick={generate}
          variant="shadow"
          color="primary"
          className="flex justify-center items-center gap-2 my-6"
          isDisabled={isGenerating}
        >
          <Sparkles className="w-5 h-5 " />
          Generate
        </Button>
      )}
      {isGenerating && (
        <div className="flex-1 h-full  w-full my-6">
          <div className="icon">
            <Sparkle className=" animate-spin duration-1000 transition-all ease-soft-spring mb-4 text-blue-500" />
          </div>
          <div className="loader_container space-y-2">
            <div className="loading-bar gradient-1 dark:gradient-1 animate-loading rounded-xl" />
            <div className="loading-bar gradient-2 dark:gradient-2 animate-loading rounded-xl" />
            <div className="loading-bar gradient-3 dark:gradient-3 animate-loading rounded-xl" />
          </div>

          <div className=" mt-10 text-center opacity-50 text-sm">
            <p>Gemini is working on it...</p>
          </div>
        </div>
      )}

      {ai && (
        <div className="my-10">
          <TextEditor content={ai} />
        </div>
      )}
    </div>
  );
};

export default PdfSum;
