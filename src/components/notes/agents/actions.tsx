"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function generateFlashcards(text: string) {
  const { object } = await generateObject({
    model: google("models/gemini-1.5-pro-latest"),
    schema: z.object({
      flashcards: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      ),
    }),
    prompt: `Generate flashcards from the following text:

"${text}"

The flashcards should consist of a question and an answer, covering the key points and important information from the text. Each flashcard should have a clear and concise question and an accurate and informative answer.`,
  });

  return object;
}
