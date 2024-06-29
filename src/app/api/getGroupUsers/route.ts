import { NextRequest, NextResponse } from "next/server";
import { firestore, auth } from "../../../../firebase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const groupId = searchParams.get("groupId");

  if (!firestore || !auth) {
    return NextResponse.json({ users: [] }, { status: 500 });
  }

  if (!groupId) {
    return NextResponse.json({ users: [] });
  }

  try {
    const groupDoc = await firestore.collection("groups").doc(groupId).get();

    if (!groupDoc.exists) {
      return NextResponse.json({ users: [] }, { status: 404 });
    }

    const groupData = groupDoc.data();
    const userIds = groupData?.members || [];

    const users = await Promise.all(
      userIds.map(async (userId: string) => {
        if (auth !== undefined) {
          const userRecord = await auth.getUser(userId);
          return {
            id: userRecord.uid,
            name: userRecord.displayName,
            email: userRecord.email,
            photoURL: userRecord.photoURL,
          };
        }
      })
    );

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users: ", error);
    return NextResponse.json({ users: [], error: error }, { status: 500 });
  }
}
