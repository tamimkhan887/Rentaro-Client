import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The All Equipment page (/equipment) is a public route
  if (pathname === "/equipment" || pathname === "/equipment/") {
    return NextResponse.next();
  }

  // Check user session for private routes
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect viewDetails (/equipment/:id+), all dashboard routes (/dashboard/:path*), and checkout
  matcher: [
    "/equipment/:id+",
    "/dashboard/:path*",
    "/checkout/:path*",
  ],
};

export default proxy;
