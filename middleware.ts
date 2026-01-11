import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = new URL(req.url);
    const pathname = url.pathname;

    // If logged in and visiting "/", redirect to /home
    if (token && pathname === "/") {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/sign-in",
          "/sign-up",
          "/pricing",
          "/easy-wins",
          "/features",
        ];

        // Check if the route is public
        if (publicRoutes.includes(pathname)) {
          return true;
        }

        // For all other routes, require authentication
        return !!token;
      },
    },
    pages: {
      signIn: "/sign-in",
    },
  }
);

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
