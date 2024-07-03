import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { firestore, storage } from "../../../../firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export const api = {
  bodyParser: false,
};

export async function POST(request: NextRequest) {
  try {
    if (!firestore) {
      return NextResponse.json(
        { message: "Firestore is not initialized" },
        { status: 500 }
      );
    }

    const data = await request.formData();
    const file = data.get("file") as File | null;
    const userId = data.get("userId") as string | null;

    if (!file) {
      console.error("No file found in the request");
      return new NextResponse("No file uploaded.", { status: 400 });
    }

    if (!userId) {
      console.error("No user ID found in the request");
      return new NextResponse("No user ID provided.", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `trans/${randomUUID()}-${file.name}`;

    const bucket = storage!.bucket("gs://valensai.appspot.com");
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    });

    const [downloadURL] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    const fileUUID = randomUUID();

    const uploadRef = firestore.collection("transcriptions").doc();
    await uploadRef.set({
      fileName: fileName,
      userId,
      fileUUID,
      fileURL: downloadURL,
      mimeType: file.type,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { url: downloadURL, docId: uploadRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error },
      { status: 500 }
    );
  }
}
