"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { storage } from "../../../firebase/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
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


    use this '<break time="1.0s" />' to add breaks if you want becuase I am converting this script to audio later.
Topic: ${text}`,
  });

  return object;
}

export async function saveConcatenatedAudioFile(
  title: string,
  base64String: string,
  audioUrls: string[],
  userId: string
): Promise<string | undefined> {
  try {
    const buffer = Buffer.from(base64String, "base64");
    const bucket = storage!.bucket();

    const fileName = `podcast/${userId}/${title}_${Date.now()}.mp3`;

    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, {
      contentType: "audio/mp3",
    });

    const [downloadURL] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    const tmpFolderPath = `podcast/${userId}/tmp/`;
    await deleteAllTmp("gs://valensai.appspot.com", tmpFolderPath);

    return downloadURL;
  } catch (error) {
    console.error("Error in saveConcatenatedAudioFile:", error);
    throw new Error("Failed to save concatenated audio file.");
  }
}

async function deleteAllTmp(bucketName: string, folderPath: string) {
  const bucket = storage!.bucket(bucketName);
  const [files] = await bucket.getFiles({ prefix: folderPath });

  if (files.length === 0) {
    return;
  }

  for (const file of files) {
    await file.delete();
  }
}
