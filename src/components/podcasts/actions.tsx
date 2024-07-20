"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import Crunker from "crunker";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { storage } from "../../../firebase/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function generatePodcastScript(text: string) {
  const { object } = await generateObject({
    model: google("models/gemini-1.5-pro-latest"),
    schema: z.object({
      title: z.string().describe("Add a short title for this podcast"),
      podcastScript: z.array(
        z.object({
          speaker: z.enum(["eslam", "aya"]),
          text: z.string(),
        })
      ),
    }),
    prompt: `You are a podcast script generator designed to assist medical students in enhancing their learning experience. Create a professional podcast conversation script featuring two hosts, Eslam and Aya, discussing the given topic. The dialogue should be dynamic and interactive, with both hosts taking turns to speak. Eslam should begin with an introduction, followed by an engaging back-and-forth conversation. Both hosts should share information, ask each other questions, and ensure that all key points are covered. Use medical terminology appropriately and make the conversation both informative and captivating for medical students. Cover the topic comprehensively from start to finish, ensuring no points are missed.

Topic: ${text}`,
  });

  return object;
}

// Save the concatenated file to Firebase Storage

export async function saveConcatenatedAudioFile(
  title: string,
  buffer: ArrayBuffer,
  payload: { audioUrls: string[] } // Ensure this type definition matches the expected structure
) {
  try {
    const bucket = storage!.bucket("gs://valensai.appspot.com");

    const concatenatedFileName = `podcast/${title}_concatenated_${uuid()}.mp3`;
    const fileRef = bucket.file(concatenatedFileName);

    await fileRef.save(new Uint8Array(buffer), {
      contentType: "audio/mp3",
    });

    const [downloadURL] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    // Delete the separate audio files
    for (const audioUrl of payload.audioUrls) {
      const fileNameToDelete = audioUrl.split("/").pop();
      if (fileNameToDelete) {
        const fileRefToDelete = bucket.file(fileNameToDelete);
        await fileRefToDelete.delete();
      }
    }

    return downloadURL;
  } catch (error) {
    console.log(error);
  }
}
