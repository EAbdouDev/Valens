import { NextRequest, NextResponse } from "next/server";
import { storage } from "../../../../../firebase/server";

async function saveConcatenatedAudioFile(
  title: string,
  buffer: ArrayBuffer,
  payload: { audioUrls: string[] },
  userId: string
): Promise<string | undefined> {
  try {
    const bucket = storage!.bucket();

    const fileName = `podcast/${userId}/${title}_${Date.now()}.mp3`;

    const fileRef = bucket.file(fileName);

    await fileRef.save(new Uint8Array(buffer), {
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

export async function POST(request: NextRequest) {
  try {
    const { title, buffer, result: payload, userId } = await request.json();

    if (!title || !buffer || !payload) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const uint8ArrayBuffer = new Uint8Array(buffer);
    const arrayBuffer = uint8ArrayBuffer.buffer;
    const downloadURL = await saveConcatenatedAudioFile(
      title,
      arrayBuffer,
      payload,
      userId
    );

    return NextResponse.json({ url: downloadURL }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
