import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../../firebase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");

  if (!firestore) {
    return NextResponse.json({ groups: [] }, { status: 500 });
  }

  if (!userId) {
    return NextResponse.json({ groups: [] });
  }

  try {
    const groupsRef = firestore.collection("groups");
    const snapshot = await groupsRef.where("createdBy", "==", userId).get();

    const groups = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          members: data.members,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          createdBy: data.createdBy,
        };
      })
      .sort(
        (a, b) =>
          (b.createdAt ? b.createdAt.getTime() : 0) -
          (a.createdAt ? a.createdAt.getTime() : 0)
      )
      .map((group) => ({
        ...group,
        createdAt: group.createdAt ? group.createdAt.toISOString() : null,
      }));

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error fetching groups: ", error);
    return NextResponse.json({ groups: [], error: error }, { status: 500 });
  }
}
