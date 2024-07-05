import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../../../firebase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    if (!firestore) {
      return new NextResponse("Internal error; no firestore was found", {
        status: 500,
      });
    }

    const userDocument = await firestore
      .collection("users")
      .doc(params.userId)
      .get();

    const userData = userDocument.data();
    console.log(userData?.role);

    return NextResponse.json(userData);
  } catch (error) {
    return new NextResponse(`Internal Error: ${error}`, { status: 500 });
  }
}
