"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { firestore } from "../../../../firebase/server";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function generateFlashcards(text: string) {
  const { object } = await generateObject({
    model: google("models/gemini-1.5-pro-latest"),
    schema: z.object({
      title: z.string(),
      flashcards: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      ),
    }),
    prompt: `Generate  flashcards from the following text:

"${text}"

The output should consist of a title and a list of flashcards. Each flashcard should consist of a question and an answer, covering the key points and important information from the text. Each flashcard should have a clear and concise question and an accurate and informative answer.


after generating flashcards generate a short title for this flashcards group
`,
  });

  return object;
}

export async function saveFlashcards(
  flashcards: any,
  noteSlug: string,
  userId: string,
  title: string
) {
  try {
    const docRef = await firestore!.collection("flashcards").add({
      title: title,
      flashcards: flashcards,
      createdAt: new Date().toISOString(),
      createdBy: userId,
      noteSlug: noteSlug,
    });
    return { id: docRef.id };
  } catch (e) {
    console.error("Error saving flashcards: ", e);
    throw new Error("Error saving flashcards");
  }
}

export async function getNoteFlashcards(noteSlug: string, userId: string) {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const flashcardsSnapshot = await firestore
      .collection("flashcards")
      .where("createdBy", "==", userId)
      .where("noteSlug", "==", noteSlug)
      .orderBy("createdAt", "desc")
      .get();

    if (flashcardsSnapshot.empty) {
      return [];
    }

    const flashcards = flashcardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return flashcards;
  } catch (e) {
    console.error("Error fetching flashcards: ", e);
    throw new Error("Error fetching flashcards");
  }
}

export async function generateslides(text: string) {
  const prompt = `
   You are an AI PowerPoint maker. Your task is to take note text provided to you and create a PowerPoint presentation in HTML format. Here are the instructions and format you need to follow:

Instructions:
Title Slide:

The first slide should be the title slide.
It should include the title of the presentation and the subtitle (if provided).
Content Slides:

Each section of the note should be converted into individual slides.
Use headings in the note to determine the titles of the slides.
Include bullet points, images, and any other content as described in the notes.
Formatting:

Use proper HTML tags to structure the slides.
Ensure each slide has a title (<h1> for the title slide, <h2> for slide titles).
Use <ul> and <li> for bullet points.
Images should be included using <img> tags with proper paths.
Separate each slide with <hr>.
Use <h1> for the main heading of each slide. Headings should be bold and centered.
Use <p> for regular text. Paragraphs should be left-aligned.
Use <ul> for unordered lists and <ol> for ordered lists, with <li> for list items.
Use <strong> for bold text and <em> for italicized text where appropriate.
Styling:

Apply basic styling using inline CSS to make the slides visually appealing.
Use appropriate font sizes for titles and bullet points.
Ensure good contrast between text and background for readability.
Final Slide:

The last slide should be a "Thank You" slide.

    Here is the note text: ${text}
  `;

  const { object } = await generateObject({
    model: google("models/gemini-1.5-pro-latest"),
    schema: z.object({
      htmlSlides: z.string(),
    }),
    prompt,
  });

  return object;
}

export async function generateSummary(textPdf: string) {
  const prompt = `You are an advanced AI capable of reading and understanding complex texts. Your task is to read the provided text and generate a concise, coherent, and informative summary of it. The summary should be in the form of HTML to be displayed on a webpage. Follow these instructions carefully:

Input Text: You will be given a block of text. Read and understand this text thoroughly.
Generate Summary: Extract the key points and main ideas from the text. Ensure the summary is concise and captures the essence of the original content. The summary can be long if needed, but it should explain the concepts in the text in a way that is easy to understand and don't miss any points.
add the resources at the end.
Format as HTML: The summary should be formatted as HTML. Use appropriate HTML tags to structure the summary, making sure it is easy to read and visually appealing.
Guidelines for HTML Formatting:
Use <h1> for the main heading of the summary.
Use <h2> for subheadings if needed.
Use <h3> also.
Use <p> for paragraphs.
Use <ul> and <li> for bullet points if listing important points.
Use <hr/> to add a line between each section.
Ensure there is sufficient spacing between sections using <br/> tags for line breaks.
Ensure the HTML is properly structured and valid.
Just return the summary and don't retrun any other text and don't mention that this HTML Document.
Don't miss any point at all.

here is the text: ${textPdf}
`;

  const { text } = await generateText({
    model: google("models/gemini-1.5-pro-latest"),
    prompt,
  });

  return text;
}

export const uploadToGemini = async () => {
  console.log("start");

  const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY!
  );

  // Initialize a Gemini model appropriate for your use case.
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });

  const result = await model.generateContent([
    {
      fileData: {
        fileUri:
          "https://firebasestorage.googleapis.com/v0/b/valensai.appspot.com/o/podcast%2FpxLOWxOHxwYqmbosvimAIF5A4Sh1%2FHormone%20Axes%3A%20A%20Balancing%20Act_1722586610955.mp3",
        mimeType: "audio/mpeg",
      },
    },
    {
      text: ` Please provide a summary for the audio.
    Provide chapter titles with timestamps, be concise and short, no need to provide chapter summaries.
    Do not make up any information that is not part of the audio and do not be verbose.`,
    },
  ]);

  return result.response.text();
};

export const tidyNote = async (noteText: any) => {
  const prompt = `
   You are an AI assistant specializing in optimizing written content while preserving the original meaning and medical terminology. Your task is to tidy up the provided notes by enhancing headings, subheadings, vocabulary, spelling, and grammar without changing the meaning or deleting any information. 

Follow these Instructions:

Headings and Subheadings:
- Improve the clarity and structure of headings and subheadings.
- Ensure that headings are appropriately formatted (e.g., <h1>, <h2>, <h3>, etc.).
- Split the text into sections with clear headings and subheadings for easy understanding.
- use <strong> tag for bold text.

Vocabulary:
- Enhance vocabulary to make the text clearer and more concise.
- Do not change any medical terms or their meanings.
- Avoid deleting any information from the notes.
- Ensure the content remains accurate and professional.

Spelling and Grammar:
- Correct any spelling errors.
- Fix any grammatical mistakes.
- Ensure that the text reads smoothly and professionally.

Simplified Explanations:
- If the concepts are complex, add a better, simpler, and fun explanation under each section.
- Prefix each explanation with "<mark>From Gemini:</mark>".
- Add a line before and after each explanation from Gemini using <hr /> and add spaces after and before the section.
- add background red to this div using tailwindcss

Medical Term Explanations:
- Provide explanations for medical terms under the relevant sections.
- Prefix each explanation with "<mark>From Gemini:</mark>".
- Add a line before and after each explanation from Gemini using <hr /> and add spaces after and before the section.
- add background red to this div using tailwindcss

Formatting and Spacing:
- Ensure good formatting and spacing for readability.
- Maintain the original HTML structure.
- Ensure that the optimized text is returned in the same HTML format.
- Do not remove any existing HTML tags unless necessary for clarity.
- use good spacing, you can use &nbsp; or <br/>.
- add spaces before and after each section.

add a Summary section at the end.
return the html directly without specifiying that this html and don't forget about the spacing.

here is the note text: ${noteText}
  `;

  const { text } = await generateText({
    model: google("models/gemini-1.5-pro-latest"),
    prompt,
  });

  return text;
};

export async function generateMermaid(text: string) {
  const prompt = `
    You are an AI that converts HTML notes to Mermaid diagrams. Your task is to take the HTML provided to you and create a Mermaid diagram. Here are the instructions and format you need to follow:

Instructions:
1. Convert the headings to diagram titles.
2. Convert lists to flowchart nodes.
3. Maintain the hierarchy and structure of the original HTML.

Here is the HTML text: ${text}
  `;

  const { object } = await generateObject({
    model: google("models/gemini-1.5-pro-latest"),
    schema: z.object({
      mermaidDiagram: z.string(),
    }),
    prompt,
  });

  return object.mermaidDiagram;
}
