import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";
import { JSDOM } from "jsdom"; // Import jsdom for parsing HTML
import { storage } from "../../../../firebase/server";

async function saveFile(
  title: string,
  buffer: ArrayBuffer,
  userId: string
): Promise<string | undefined> {
  try {
    const bucket = storage!.bucket();

    const fileName = `ppts/${userId}/${title}_${Date.now()}.pptx`;

    const fileRef = bucket.file(fileName);

    await fileRef.save(new Uint8Array(buffer), {
      contentType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });

    const [downloadURL] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    return downloadURL;
  } catch (error) {
    console.error("Error in saving file:", error);
    throw new Error("Failed to save file.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { html, userId, title } = await req.json();

    // Parse HTML content into slides
    const dom = new JSDOM(html);
    const slidesContent = dom.window.document.body.innerHTML
      .split("<hr>")
      .map((slide: any) => slide.trim());

    const pptx = new PptxGenJS();

    // Define styles
    const titleStyle = {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 24,
      bold: true,
      color: "363636",
      align: "center",
    };
    const contentStyle = {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 0.5,
      fontSize: 18,
      color: "363636",
      align: "left",
    };

    slidesContent.forEach((slideContent: any, slideIdx: any) => {
      const slide = pptx.addSlide();
      const domSlide = new JSDOM(slideContent).window.document;

      // Process titles and paragraphs
      domSlide
        .querySelectorAll("h1, h2, h3, h4, h5, h6, p")
        .forEach((element: any, idx: any) => {
          const text = element.textContent || "";
          const style = idx === 0 ? titleStyle : contentStyle;
          //@ts-expect-error
          slide.addText(text, { ...style, y: style.y! + idx * 0.5 });
        });
    });

    const pptxBase64 = (await pptx.write({ outputType: "base64" })) as string; // Ensure it is treated as a string
    const pptxBuffer = Buffer.from(pptxBase64, "base64");

    const downloadURL = await saveFile(title, pptxBuffer, userId);

    return NextResponse.json({ url: downloadURL }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
