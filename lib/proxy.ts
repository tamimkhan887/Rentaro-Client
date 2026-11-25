import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // The All Equipment page (/equipment) is a public route
    if (pathname === "/equipment" || pathname === "/equipment/") {
        return NextResponse.next();
    }

    // Check for Better Auth session token in cookies (Edge-safe without database dependency)
    const sessionToken =
        request.cookies.get("better-auth.session_token")?.value ||
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
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
