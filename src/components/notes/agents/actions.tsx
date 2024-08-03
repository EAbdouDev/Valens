"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { firestore } from "../../../../firebase/server";

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

export async function getNoteFlashcards(
  
  noteSlug: string,
  userId: string,
  
) {
  try {
    if (!firestore) {
      throw new Error("Firestore is not initialized.");
    }

    const flashcardsSnapshot = await firestore
      .collection("flashcards")
      .where("createdBy", "==", userId).where('noteSlug', '==', noteSlug)
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
