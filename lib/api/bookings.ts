import { Booking, BookingInput } from "@/types/equipment"
import { authClient } from "@/lib/auth-client"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

async function getAuthHeaders(): Promise<HeadersInit> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access-token")
    if (token) return { authorization: `Bearer ${token}` }

    try {
      const session = await authClient.getSession()
      const sessionToken = session?.data?.session?.token
      if (sessionToken) {
        return { authorization: `Bearer ${sessionToken}` }
      }
    } catch {
      // Ignore session fetch error
    }
  }
  return {}
}

export async function createBooking(
  data: BookingInput
): Promise<{ success?: boolean; insertedId?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) {
      return { error: result.error || "Failed to create booking" }
    }
    return result
  } catch (error) {
    console.error("Error in createBooking:", error)
    return { error: "Failed to connect to booking service" }
  }
}

export async function getUserBookings(userEmail: string): Promise<Booking[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/bookings?userEmail=${encodeURIComponent(userEmail)}`,
      {
        cache: "no-store",
        headers: await getAuthHeaders(),
      }
    )
    if (!res.ok) {
      return []
    }
    return await res.json()
  } catch (error) {
    console.error("Error in getUserBookings:", error)
    return []
  }
}

export async function getOwnerBookings(ownerEmail: string): Promise<Booking[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/bookings?ownerEmail=${encodeURIComponent(ownerEmail)}`,
      {
        cache: "no-store",
        headers: await getAuthHeaders(),
      }
    )
    if (!res.ok) {
      return []
    }
    return await res.json()
  } catch (error) {
    console.error("Error in getOwnerBookings:", error)
    return []
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, {
      cache: "no-store",
      headers: await getAuthHeaders(),
    })
    if (!res.ok) {
      return []
    }
    return await res.json()
  } catch (error) {
    console.error("Error in getAllBookings:", error)
    return []
  }
}

export async function getAllBookingsWithError(): Promise<Booking[]> {
  const res = await fetch(`${BASE_URL}/bookings`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  })
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.message || errData.error || `Failed to fetch bookings (${res.status} ${res.statusText})`)
  }
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function updateBookingStatus(
  id: string,
  status: string
): Promise<{ success?: boolean; error?: string; modifiedCount?: number }> {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({ status }),
    })
    const result = await res.json()
    if (!res.ok) {
      return { error: result.error || result.message || "Failed to update booking status" }
    }
    return result
  } catch (error) {
    console.error("Error in updateBookingStatus:", error)
    return { error: "Failed to connect to booking service" }
  }
}
