import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { v4 as uuid } from "uuid";
import path from "path";
import { storage } from "../../../../../firebase/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error("ELEVENLABS_API_KEY is not set");
  throw new Error("ELEVENLABS_API_KEY is not set");
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

const voices = {
  eslam: "mZ8K1MPRiT5wDQaasg3i",
  aya: "P7x743VjyZEOihNNygQ9",
};

type Host = keyof typeof voices;

const uploadAudioToFirebase = async (audioStream: any, fileName: any) => {
  const bucket = storage!.bucket("gs://valensai.appspot.com");
  const fileRef = bucket.file(fileName);

  const writeStream = fileRef.createWriteStream({
    metadata: { contentType: "audio/mp3" },
  });

  return new Promise<string>((resolve, reject) => {
    audioStream
      .pipe(writeStream)
      .on("finish", async () => {
        try {
          const [downloadURL] = await fileRef.getSignedUrl({
            action: "read",
            expires: "03-01-2500",
          });
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
};

const createAudioFileFromText = async (
  text: string,
  voiceId: string
): Promise<string> => {
  try {
    const audio = await client.generate({
      voice: voiceId,
      model_id: "eleven_turbo_v2",
      text,
    });

    const fileName = `podcast/tmp/${uuid()}.mp3`;
    return await uploadAudioToFirebase(audio, fileName);
  } catch (error) {
    console.error(
      `Error generating audio for text "${text}" with voice "${voiceId}":`,
      error
    );
    throw error;
  }
};

const isValidHost = (host: string): host is Host => {
  return host in voices;
};

export async function POST(req: NextRequest) {
  const { podcastScript, title, userId } = await req.json();

  if (!podcastScript || !Array.isArray(podcastScript)) {
    return NextResponse.json(
      { message: "Missing or invalid transId or podcastScript" },
      { status: 400 }
    );
  }

  try {
    const audioUrls: string[] = [];

    for (const entry of podcastScript) {
      if (!entry.speaker || !entry.text) {
        throw new Error(
          "Invalid entry in podcastScript: Missing speaker or text"
        );
      }

      const host = entry.speaker.toLowerCase().trim();
      if (!isValidHost(host)) {
        throw new Error(`Invalid host: ${entry.speaker}`);
      }
      const voiceId = voices[host];
      const audioUrl = await createAudioFileFromText(entry.text, voiceId);
      audioUrls.push(audioUrl);
    }

    return NextResponse.json({ audioUrls });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error },
      { status: 500 }
    );
  }
}
