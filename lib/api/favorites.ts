import { Equipment, FavoriteItem } from "@/types/equipment"
import { getClientAuthHeaders } from "@/lib/auth-headers"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export async function checkIsFavorite(
  userEmail: string,
  equipmentId: string
): Promise<{ isFavorite: boolean; favoriteId: string | null }> {
  try {
    const res = await fetch(
      `${BASE_URL}/favorites/check?userEmail=${encodeURIComponent(
        userEmail
      )}&equipmentId=${encodeURIComponent(equipmentId)}`,
      {
        cache: "no-store",
        headers: await getClientAuthHeaders(),
      }
    )
    if (!res.ok) {
      return { isFavorite: false, favoriteId: null }
    }
    return await res.json()
  } catch (error) {
    console.error("Error in checkIsFavorite:", error)
    return { isFavorite: false, favoriteId: null }
  }
}

export async function addToFavorites(data: {
  userEmail: string
  equipmentId: string
  equipment: Equipment
}): Promise<{ success?: boolean; exists?: boolean; insertedId?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getClientAuthHeaders()),
      },
      body: JSON.stringify(data),
    })
    return await res.json()
  } catch (error) {
    console.error("Error in addToFavorites:", error)
    return { error: "Failed to add to favorites" }
  }
}

export async function removeFromFavorites(
  userEmail: string,
  equipmentId: string
): Promise<{ success: boolean; deletedCount?: number }> {
  try {
    const res = await fetch(
      `${BASE_URL}/favorites?userEmail=${encodeURIComponent(
        userEmail
      )}&equipmentId=${encodeURIComponent(equipmentId)}`,
      {
        method: "DELETE",
        headers: await getClientAuthHeaders(),
      }
    )
    if (!res.ok) {
      return { success: false }
    }
    return await res.json()
  } catch (error) {
    console.error("Error in removeFromFavorites:", error)
    return { success: false }
  }
}

export async function removeFavoriteById(
  id: string
): Promise<{ success: boolean; deletedCount?: number }> {
  try {
    const res = await fetch(`${BASE_URL}/favorites/${id}`, {
      method: "DELETE",
      headers: await getClientAuthHeaders(),
    })
    if (!res.ok) {
      return { success: false }
    }
    return await res.json()
  } catch (error) {
    console.error("Error in removeFavoriteById:", error)
    return { success: false }
  }
}

export async function getUserFavorites(userEmail: string): Promise<FavoriteItem[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/favorites?userEmail=${encodeURIComponent(userEmail)}`,
      {
        cache: "no-store",
        headers: await getClientAuthHeaders(),
      }
    )
    if (!res.ok) {
      return []
    }
    return await res.json()
  } catch (error) {
    console.error("Error in getUserFavorites:", error)
    return []
  }
}
