import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll("filepond");
  let parsedText: any = "";

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0];

    if (uploadedFile instanceof File) {
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

      const pdfParser = new PDFParser();

      const parsePdf = () =>
        new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData: any) =>
            reject(errData.parserError)
          );
          pdfParser.on("pdfParser_dataReady", () => {
            const rawTextContent = pdfParser.getRawTextContent();
            resolve(rawTextContent);
          });

          pdfParser.parseBuffer(fileBuffer);
        });

      try {
        parsedText = await parsePdf();
      } catch (error) {
        console.error("Error parsing PDF:", error);
        return new NextResponse("Error parsing PDF", { status: 500 });
      }
    } else {
      console.log("Uploaded file is not in the expected format.");
    }
  } else {
    console.log("No files found.");
  }

  return new NextResponse(parsedText, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
