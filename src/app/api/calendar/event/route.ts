import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { firestore, auth } from "../../../../../firebase/server";

export async function POST(request: NextRequest) {
  try {
    const { idToken, event } = await request.json();

    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await auth!.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Initialize OAuth2 client with your Google credentials
    const oauth2Client = new google.auth.OAuth2(
      "1012612687585-jarkhi2ru7e80dujka0jdif8ab9eoj7q.apps.googleusercontent.com",
      "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",
      "http://localhost:3000"
    );

    // Retrieve stored tokens (you should store these securely)
    const tokens = await getOAuth2Tokens(uid, idToken); // Function to get OAuth2 tokens
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Error creating calendar event" },
      { status: 500 }
    );
  }
}

// Implement a function to get OAuth2 tokens
async function getOAuth2Tokens(uid: string, idToken: string): Promise<any> {
  // Exchange the Firebase ID token for an OAuth2 token
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Using the idToken to get OAuth2 tokens
  const { tokens } = await oauth2Client.getToken(idToken);
  return tokens;
}
