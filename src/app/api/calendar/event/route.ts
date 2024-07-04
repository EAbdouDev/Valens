import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { firestore, auth } from "../../../../../firebase/server"; // Adjust the import path if necessary

export async function POST(request: NextRequest) {
  try {
    const { idToken, event } = await request.json();

    // Verify the ID token
    const decodedToken = await auth!.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Initialize OAuth2 client with your Google credentials
    const oauth2Client = new google.auth.OAuth2(
      "1012612687585-jarkhi2ru7e80dujka0jdif8ab9eoj7q.apps.googleusercontent.com",
      process.env.GOOGLE_CLIENT_SECRET,
      "YOUR_REDIRECT_URI"
    );

    // You need to get access tokens with the necessary scopes
    // Since idToken is a Firebase token, it cannot be directly used to authenticate Google APIs
    // Use OAuth2 to get the access tokens required for Google Calendar API

    // Fetch the access token using Firebase Admin SDK
    const customToken = await auth!.createCustomToken(uid);
    const { tokens } = await oauth2Client.getToken(customToken);

    oauth2Client.setCredentials(tokens);

    // Use the access token to make authorized requests
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
