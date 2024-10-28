// middleware.ts
import { log } from "console";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// import Cookies from 'js-cookie';

export async function middleware(request: NextRequest) {
  // Get the access key from cookies
  const accessKey = request.cookies.get(".AspNetCore.Session")?.value;

  // Define the paths that require authentication
  const protectedRoutes = [
    "/profileuser",
    "/favorites",
    "/history",
    "/myticket",
    "/settings",
    "/admin",
    "/sell",
  ];

  const validate = await fetch(
    "http://localhost:5296/api/Authentication/islogged",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `.AspNetCore.Session=${accessKey}`,
      },
      body: JSON.stringify({
        accessKey: accessKey,
      }),
    }
  );

  const response = await validate.json(); // Parse the JSON response
  // Check if the current route is protected and the accessKey is missing
  if (
    protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    ) &&
    response.message == "False"
  ) {
    // Redirect to the login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Continue to the requested page if authenticated or if route does not require authentication
  return NextResponse.next();
}

// Specify which routes should trigger this middleware
export const config = {
  matcher: [
    "/profile/:path*",
    "/favorites/:path*",
    "/history/:path*",
    "/myticket/:path*",
    "/settings/:path*",
    "/sell/:path*",
  ],
};
