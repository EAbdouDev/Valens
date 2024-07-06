import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { firestore, auth } from "../../../../../firebase/server";

export async function POST(request: NextRequest) {
  try {
    const { event } = await request.json();

    const oAuth2 = google.auth.OAuth2;

    const googleCert = {
      web: {
        client_id: process.env.CLIENT_ID,
        project_id: process.env.PROJECT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uris: process.env.REDIRECT_URIS,
        javascript_origins: process.env.JAVASCRIPT_ORIGINS,
        refresh_token: process.env.REFRESH_TOKEN,
      },
    };

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URIS
    );

    // Set the refresh token
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // console.log(event);

    // const eventData = {
    //   summary: event.Summary,
    //   location: event.Location,
    //   description: event.Description,
    //   start: {
    //     dateTime: event.Start.DateTime,
    //     timeZone: event.Start.TimeZone,
    //   },
    //   end: {
    //     dateTime: event.End.DateTime,
    //     timeZone: event.End.TimeZone,
    //   },
    //   recurrence: [event.Recurrence],
    //   attendees: event.Attendees,
    //   // 'reminders': {
    //   //   'useDefault': false,
    //   //   'overrides': [
    //   //     {'method': 'email', 'minutes': 24 * 60},
    //   //     {'method': 'popup', 'minutes': 10}
    //   //   ]
    //   // }
    // };

    const calendarList = await calendar.calendarList.list({
      auth: oAuth2Client,
    });

    const eventCreation = await calendar.events.insert({
      auth: oAuth2Client,
      requestBody: event,
      calendarId: "primary",
    });

    return NextResponse.json(eventCreation);
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Error creating calendar event" },
      { status: 500 }
    );
  }
}
