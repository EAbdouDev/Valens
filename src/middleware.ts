// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get("firebaseIdToken");

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
