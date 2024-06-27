import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../firebase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const searchTerm = searchParams.get("searchTerm");

  if (!auth) {
    return NextResponse.json({ users: [] }, { status: 500 });
  }

  if (!searchTerm) {
    return NextResponse.json({ users: [] });
  }

  try {
    const users = await auth.listUsers();
    const filteredUsers = users.users.filter((user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const userDetails = filteredUsers.map((user) => ({
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }));

    return NextResponse.json({ users: userDetails });
  } catch (error) {
    console.error("Error fetching users: ", error);
    return NextResponse.json({ users: [], error: error }, { status: 500 });
  }
}
