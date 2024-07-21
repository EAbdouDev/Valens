// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const allowedOrigins = [
  "https://storage.googleapis.com/valensai.appspot.com",
  "https://storage.googleapis.com",
  "https://www.valensai.com",
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get("firebaseIdToken");
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Allow access to the home page without authentication
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  // Allow access if user is authenticated
  if (userToken) {
    return NextResponse.next();
  }

  // Redirect to home page if user is not authenticated
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
