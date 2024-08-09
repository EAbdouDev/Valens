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

  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
      "Cache-Control": "no-store, max-age=0",
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  response.headers.set("Cache-Control", "no-store, max-age=0");

  if (request.nextUrl.pathname === "/") {
    return response;
  }

  if (userToken) {
    return response;
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
