import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../../firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  const { groupName, selectedUsers, userId } = await request.json();

  if (!firestore) {
    return NextResponse.json(
      { message: "Firestore is not initialized" },
      { status: 500 }
    );
  }

  try {
    const groupRef = firestore.collection("groups").doc();
    await groupRef.set({
      name: groupName,
      members: selectedUsers.map((user: any) => user.id),
      createdBy: userId,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Optionally, create or update user documents with the group information
    await Promise.all(
      selectedUsers.map(async (user: any) => {
        if (firestore !== undefined) {
          const userRef = firestore.collection("users").doc(user.id);
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            await userRef.update({
              groups: FieldValue.arrayUnion(groupRef.id),
            });
          } else {
            await userRef.set(
              {
                groups: [groupRef.id],
              },
              { merge: true }
            );
          }
        }
      })
    );

    return NextResponse.json({ message: "Group created successfully" });
  } catch (error) {
    console.error("Error adding document: ", error);
    return NextResponse.json(
      { message: "Error creating group", error: error },
      { status: 500 }
    );
  }
}
