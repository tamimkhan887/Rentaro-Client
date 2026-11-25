import "server-only"
import { headers } from "next/headers"
import { auth } from "./auth"
import { redirect } from "next/navigation"

export const getSession = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        return session
    } catch (err: any) {
        // Rethrow Next.js dynamic rendering bailouts so routes correctly switch to dynamic rendering
        if (err?.digest === "DYNAMIC_SERVER_USAGE" || err?.message?.includes("Dynamic server usage")) {
            throw err;
        }
        console.error("Error retrieving session in getSession:", err);
        return null;
    }
}

export const requireRole = async (role: string) => {
    const session = await getSession()
    if (!session?.user) {
        redirect("/login")
    }

    const userRole = ((session?.user as any)?.role || "customer").toLowerCase()
    const expectedRole = role.toLowerCase()

    let isAllowed = false
    if (expectedRole === "admin") {
        isAllowed = userRole === "admin"
    } else {
        isAllowed = userRole === expectedRole || userRole === "admin"
    }

    if (!isAllowed) {
        redirect("/unauthorize")
    }

    return session
}

export const authFetch = async (api: string, init?: RequestInit) => {
    const session = await getSession();
    const token = session?.session?.token
    const res = await fetch(api , {
        ...init,
        headers:{
            ...init?.headers,
            authorization : `Bearer ${token}`
        }
    })
    return res ;
}
