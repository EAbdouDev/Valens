import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../../firebase/server";

export async function GET(req: NextRequest) {
  try {
    if (!firestore) {
      return new NextResponse("Internal Error; no firestore was found", {
        status: 500,
      });
    }

    const response = await firestore.collection("items").get();
    const items = response.docs.map((doc) => doc.data());

    return NextResponse.json(items);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
