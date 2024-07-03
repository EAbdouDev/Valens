import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../../../firebase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { transId: string } }
) {
  try {
    if (!firestore) {
      return NextResponse.json(
        { message: "Firestore is not initialized" },
        { status: 500 }
      );
    }

    const { transId } = params;

    const docRef = firestore.collection("transcriptions").doc(transId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    const data = doc.data();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching document: ", error);
    return NextResponse.json(
      { message: "Internal Server Error.", error: error },
      { status: 500 }
    );
  }
}
