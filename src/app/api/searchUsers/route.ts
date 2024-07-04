import { NextRequest, NextResponse } from "next/server";
import { firestore, auth } from "../../../../firebase/server"; // Adjust the import path if necessary

export async function GET(request: NextRequest) {
  try {
    if (!firestore || !auth) {
      return new NextResponse(
        "Internal error; no firestore or auth was found",
        {
          status: 500,
        }
      );
    }

    // Fetch all user IDs from Firestore
    const usersCollection = firestore.collection("users");
    const usersSnapshot = await usersCollection.get();

    if (usersSnapshot.empty) {
      console.log("No users found in Firestore");
      return NextResponse.json([]);
    }

    const userIds = usersSnapshot.docs.map((doc) => doc.id);
    console.log(`Fetched user IDs from Firestore: ${userIds}`);

    // Fetch user details from Firebase Authentication
    const usersList = await Promise.all(
      userIds.map(async (userId) => {
        try {
          const userRecord = await auth!.getUser(userId);
          return {
            id: userId,
            name: userRecord.displayName,
            email: userRecord.email,
            picture: userRecord.photoURL,
          };
        } catch (error) {
          console.error(
            `Error fetching user data for userId: ${userId}`,
            error
          );
          return null;
        }
      })
    );

    // Filter out any null values (in case of errors fetching user data)
    const filteredUsersList = usersList.filter((user) => user !== null);
    console.log(`Final users list: ${JSON.stringify(filteredUsersList)}`);

    return NextResponse.json(filteredUsersList);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse(`Internal Error: ${error}`, { status: 500 });
  }
}
