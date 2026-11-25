import { authClient } from "@/lib/auth-client"

/**
 * Decodes the JWT payload without verifying signature, purely to check
 * whether a cached localStorage token belongs to the currently active user.
 */
function decodeJwtEmail(token: string): string | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(base64)
    const payload = JSON.parse(json)
    return typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : null
  } catch {
    return null
  }
}

/**
 * Returns authorization headers matching the currently active authenticated user.
 * Prevents stale JWT tokens from previous sessions from causing 403/401 errors
 * and seamlessly supports Google OAuth / Better Auth sessions.
 */
export async function getClientAuthHeaders(): Promise<HeadersInit> {
  if (typeof window === "undefined") {
    return {}
  }

  const cachedJwt = localStorage.getItem("access-token")

  try {
    const session = await authClient.getSession()
    const sessionToken = session?.data?.session?.token
    const sessionEmail = session?.data?.user?.email?.trim().toLowerCase()

    if (sessionToken && sessionEmail) {
      if (cachedJwt) {
        const jwtEmail = decodeJwtEmail(cachedJwt)
        if (jwtEmail && jwtEmail === sessionEmail) {
          return { authorization: `Bearer ${cachedJwt}` }
        }
        // Cached JWT belongs to a different user or is malformed; clear it
        localStorage.removeItem("access-token")
      }
      return { authorization: `Bearer ${sessionToken}` }
    }
  } catch {
    // Fall back to cached JWT if session check fails
  }

  if (cachedJwt) {
    return { authorization: `Bearer ${cachedJwt}` }
  }

  return {}
}
