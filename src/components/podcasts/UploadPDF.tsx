"use client";
import { FC } from "react";
import pdfToText from "react-pdftotext";
import { Input } from "../ui/input";

interface UploadPDFProps {}

const UploadPDF: FC<UploadPDFProps> = ({}) => {
  function extractText(event: any) {
    const file = event?.target?.files[0];
    pdfToText(file)
      .then((text) => console.log(text))
      .catch((error) => console.log(error));
  }
  return (
    <div>
      <Input type="file" accept="application/pdf" onChange={extractText} />
    </div>
  );
};

export default UploadPDF;
