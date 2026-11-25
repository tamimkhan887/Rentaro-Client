import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

function getClientBaseUrl(): string {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    const envUrl = process.env.BETTER_AUTH_URL;
    if (envUrl && !envUrl.includes("localhost")) {
        return envUrl.replace(/\/$/, "");
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return envUrl || "http://localhost:3000";
}

export const authClient = createAuthClient({
    baseURL: getClientBaseUrl(),
    plugins: [
        inferAdditionalFields<typeof auth>()
    ]
})

export const { signIn, signUp, signOut, useSession } = authClient
