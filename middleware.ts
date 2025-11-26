import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public marketing pages
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/pricing",
  "/easy-wins",
  "/features",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);
  const pathname = url.pathname;

  // ⭐ If logged in & visiting "/", redirect to /home
  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // ⭐ Allow all public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // ⭐ Block protected routes when user is NOT logged in
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
