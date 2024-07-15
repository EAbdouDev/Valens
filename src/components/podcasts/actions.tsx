"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function generatePodcastScript(text: string) {
  const { object } = await generateObject({
    model: google("models/gemini-1.5-pro-latest"),
    schema: z.object({
      title: z.string().describe("add a short title for this podcast"),
      podcastScript: z.object({
        eslam: z.array(z.string()),
        aya: z.array(z.string()),
      }),
    }),
    prompt: `You are a podcast script generator designed to assist medical students in enhancing their learning experience. Create a professional podcast conversation script featuring two hosts, Eslam and Aya, discussing the given topic. The dialogue should be dynamic and interactive, with both hosts taking turns to speak. Eslam should begin with an introduction, followed by an engaging back-and-forth conversation. Both hosts should share information, ask each other questions, and ensure that all key points are covered. Use medical terminology appropriately and make the conversation both informative and captivating for medical students. and don't miss any points.

Note: ${text}`,
  });

  return object;
}
